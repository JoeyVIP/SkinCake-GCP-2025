export interface WPPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified?: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const API_BASE = process.env.WORDPRESS_API_URL || 'https://skincake.online/wp-json/wp/v2';

// GCP 環境檢測
const isCloudRun = process.env.K_SERVICE !== undefined;

// 創建標準化的請求標頭 - GCP 優化
function createFetchHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'SkinCake/2.0 (Next.js)'
  };

  // GCP Cloud Run 環境特殊標頭
  if (isCloudRun) {
    headers['X-Source'] = 'gcp-cloud-run';
    headers['X-Client'] = 'skincake-app';
    headers['X-Environment'] = 'production';
  }

  return headers;
}

// 帶重試機制的 fetch 函數 - GCP 優化版本
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = isCloudRun ? 1 : 2): Promise<Response> {
  const isServer = typeof window === 'undefined';
  const timeoutMs = isCloudRun ? 10000 : 15000;

  // 只有在伺服器端 (Node) 才使用 AbortSignal.timeout，瀏覽器端避免相容性問題
  let signal: AbortSignal | undefined = undefined;
  if (isServer) {
    if (typeof (AbortSignal as any).timeout === 'function') {
      signal = (AbortSignal as any).timeout(timeoutMs);
    } else {
      // Fallback：自行建立 AbortController
      const controller = new AbortController();
      setTimeout(() => controller.abort(), timeoutMs);
      signal = controller.signal;
    }
  }

  // 統一請求配置 - 修復快取衝突
  const baseOptions: RequestInit = {
    ...options,
    headers: {
      ...createFetchHeaders(),
      ...options.headers
    },
    ...(signal ? { signal } : {})
  };

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const response = await fetch(url, baseOptions);
      
      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url,
          attempt,
          isCloudRun
        };
        
        if (isCloudRun) {
          console.error('GCP API request failed:', errorDetails);
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      const isLastAttempt = attempt === retries + 1;
      
      if (isLastAttempt) {
        if (isCloudRun) {
          console.error('GCP API request exhausted retries:', {
            url,
            attempts: attempt,
            error: error instanceof Error ? error.message : 'Unknown error',
            environment: 'cloud-run'
          });
        }
        throw error;
      }
      
      // 等待後重試 - GCP 環境縮短等待時間
      const delay = isCloudRun ? attempt * 500 : attempt * 1000; // 0.5s, 1s vs 1s, 2s
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (isCloudRun) {
        console.warn(`GCP API retry attempt ${attempt + 1}:`, {
          url,
          delay: `${delay}ms`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }
  
  throw new Error('This should never be reached');
}

export async function getRecentPosts(count: number = 6): Promise<WPPost[]> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE}/posts?per_page=${count}&_embed&status=publish`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 3600 }, // 1小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=3600' }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getRecentPosts failed:', {
        count,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching recent posts:', error);
    }
    return [];
  }
}

export async function getRandomPosts(count: number = 6, excludeId?: number): Promise<WPPost[]> {
  try {
    // 檢測是否在 build 時
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
    
    // 加入時間戳確保每次請求都不同，避免任何形式的快取
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // 獲取最新的 100 篇文章（和原始版本一致）
    const response = await fetchWithRetry(
      `${API_BASE}/posts?per_page=100&orderby=date&order=desc&_embed&status=publish&_t=${timestamp}&_r=${randomSeed}`,
      { 
        // 在 build 時只使用 force-cache，運行時使用 revalidate
        ...(isBuildTime ? {
          cache: 'force-cache'
        } : {
          next: { revalidate: 60 }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const posts: WPPost[] = await response.json();
    
    if (!posts || posts.length === 0) {
      console.warn('No posts available for random selection');
      return [];
    }
    
    // 移除被排除的文章
    const filteredPosts = excludeId 
      ? posts.filter(post => post.id !== excludeId)
      : posts;

    if (filteredPosts.length === 0) {
      return [];
    }
    
    // 使用 Fisher-Yates 洗牌算法隨機排序
    const shuffled = [...filteredPosts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  } catch (error) {
      console.error('Error fetching random posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    // 🔧 修復：正確編碼 slug 參數以支持中文字符
    const encodedSlug = encodeURIComponent(slug);
    const response = await fetchWithRetry(
      `${API_BASE}/posts?slug=${encodedSlug}&_embed&status=publish`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 3600 }, // 1小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=3600' }
        })
      }
    );
    
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getPostBySlug failed:', {
        slug,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching post:', error);
    }
    return null;
  }
}

export async function getAllPosts(page: number = 1, perPage: number = 50): Promise<WPPost[]> {
  try {
    // GCP 環境：大幅減少資料量避免超時，只獲取必要欄位
    const actualPerPage = isCloudRun ? Math.min(perPage, 15) : perPage;
    
    const response = await fetchWithRetry(
      `${API_BASE}/posts?per_page=${actualPerPage}&page=${page}&status=publish&_fields=id,slug,title,date,modified`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 7200 }, // 2小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=7200' }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getAllPosts failed:', {
        page,
        perPage,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching all posts:', error);
    }
    return [];
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE}/categories?per_page=50&hide_empty=false&_fields=id,name,slug,count`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 7200 }, // 2小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=7200' }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getCategories failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching categories:', error);
    }
    return [];
  }
}

export async function getPostsByCategory(categoryId: number, count: number = 10): Promise<WPPost[]> {
  try {
    const actualCount = isCloudRun ? Math.min(count, 6) : count;
    
    const response = await fetchWithRetry(
      `${API_BASE}/posts?categories=${categoryId}&per_page=${actualCount}&_embed&status=publish`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 3600 }, // 1小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=3600' }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getPostsByCategory failed:', {
        categoryId,
        count,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching posts by category:', error);
    }
    return [];
  }
}

export async function getPostsByCategoryWithPagination(
  categoryId: number, 
  page: number = 1, 
  perPage: number = 12,
  orderBy: 'date' | 'title' | 'comment_count' = 'date',
  order: 'asc' | 'desc' = 'desc'
): Promise<{ posts: WPPost[], totalPages: number, total: number }> {
  try {
    // GCP 環境：大幅減少每頁數量避免超時
    const actualPerPage = isCloudRun ? Math.min(perPage, 6) : perPage;
    
    const isBrowser = typeof window !== 'undefined';
    const urlPath = `posts?categories=${categoryId}&per_page=${actualPerPage}&page=${page}&orderby=${orderBy}&order=${order}&_embed&status=publish&_fields=id,slug,title,date,featured_media,_links,_embedded`;

    const fullUrl = isBrowser 
      ? `/api/wp/${urlPath}` 
      : `${API_BASE}/${urlPath}`;

    const response = isBrowser
      ? await fetch(fullUrl, { cache: 'no-store' })
      : await fetchWithRetry(fullUrl, { 
          next: { revalidate: 3600 },
          ...(isCloudRun && { headers: { 'Cache-Control': 'public, max-age=3600' } })
        });
    
    const posts = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const total = parseInt(response.headers.get('X-WP-Total') || '0');
    
    return { posts, totalPages, total };
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getPostsByCategoryWithPagination failed:', {
        categoryId,
        page,
        perPage,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching posts by category with pagination:', error);
    }
    return { posts: [], totalPages: 0, total: 0 };
  }
}

export async function getRelatedCategories(categoryId: number): Promise<WPCategory[]> {
  try {
    // 獲取當前分類的所有文章
    const posts = await getPostsByCategory(categoryId, 10);
    
    // 收集所有相關分類ID
    const relatedCategoryIds = new Set<number>();
    posts.forEach(post => {
      post.categories.forEach(catId => {
        if (catId !== categoryId) {
          relatedCategoryIds.add(catId);
        }
      });
    });

    if (relatedCategoryIds.size === 0) return [];

    // 獲取相關分類詳細資訊
    const categories = await getCategories();
    return categories.filter(cat => relatedCategoryIds.has(cat.id));
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getRelatedCategories failed:', {
        categoryId,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching related categories:', error);
    }
    return [];
  }
}

export async function getPostsByTag(tagId: number, count: number = 10): Promise<WPPost[]> {
  try {
    const actualCount = isCloudRun ? Math.min(count, 6) : count;
    
    const response = await fetchWithRetry(
      `${API_BASE}/posts?tags=${tagId}&per_page=${actualCount}&_embed&status=publish`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 3600 }, // 1小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=3600' }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getPostsByTag failed:', {
        tagId,
        count,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching posts by tag:', error);
    }
    return [];
  }
}

export async function getCategoryById(categoryId: number): Promise<WPCategory | null> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE}/categories/${categoryId}?_fields=id,name,slug,description,count`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 7200 }, // 2小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=7200' }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getCategoryById failed:', {
        categoryId,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching category:', error);
    }
    return null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  try {
    const categories = await getCategories();
    
    // 先嘗試直接匹配
    let category = categories.find(cat => cat.slug === slug);
    
    // 如果沒找到，嘗試 URL 編碼匹配
    if (!category) {
      const encodedSlug = encodeURIComponent(slug);
      category = categories.find(cat => cat.slug === encodedSlug);
    }
    
    // 如果還沒找到，嘗試解碼後匹配
    if (!category) {
      try {
        const decodedSlug = decodeURIComponent(slug);
        category = categories.find(cat => cat.name === decodedSlug);
      } catch (e) {
        // 解碼失敗，忽略
      }
    }
    
    return category || null;
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getCategoryBySlug failed:', {
        slug,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching category by slug:', error);
    }
    return null;
  }
}

export async function getCategoriesExcludeUncategorized(): Promise<WPCategory[]> {
  try {
    const categories = await getCategories();
    return categories
      .filter(cat => cat.slug !== 'uncategorized' && cat.name !== '未分類')
      .sort((a, b) => a.id - b.id); // 按 ID 排序，方便後台調整順序
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getCategoriesExcludeUncategorized failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching filtered categories:', error);
    }
    return [];
  }
}

export async function getTags(): Promise<WPTag[]> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE}/tags?per_page=50&hide_empty=true&_fields=id,name,slug,count`,
      { 
        // 修復：生產環境也要有快取
        next: { revalidate: 7200 }, // 2小時快取
        ...(isCloudRun && { 
          // GCP 環境額外設定
          headers: { 'Cache-Control': 'public, max-age=7200' }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getTags failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    } else {
      console.error('Error fetching tags:', error);
    }
    return [];
  }
}

export function getFeaturedImageUrl(post: WPPost): string {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  
  if (imageUrl) {
    return imageUrl;
  }
  
  // 使用絕對 URL 作為預設圖片，確保 Facebook 可以正確抓取
  const baseUrl = process.env.FRONTEND_DOMAIN || 'https://skincake.tw';
  return `${baseUrl}/images/default-post-image.svg`;
}

export function getCategoryNames(post: WPPost): string[] {
  const categories = post._embedded?.['wp:term']?.[0] || [];
  return categories.map(cat => cat.name);
}

export function getTagNames(post: WPPost): string[] {
  const tags = post._embedded?.['wp:term']?.[1] || [];
  return tags.map(tag => tag.name);
} 