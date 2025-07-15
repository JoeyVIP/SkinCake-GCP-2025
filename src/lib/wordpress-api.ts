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
  // 統一請求配置 - 修復快取衝突
  const baseOptions: RequestInit = {
    ...options,
    headers: {
      ...createFetchHeaders(),
      ...options.headers
    },
    // GCP 環境：使用較短的超時時間避免建置逾時
    signal: AbortSignal.timeout(isCloudRun ? 10000 : 15000)
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
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' } // GCP: 不快取避免建置問題
          : { next: { revalidate: 3600 } } // 本地: 使用 ISR
        )
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

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE}/posts?slug=${slug}&_embed&status=publish`,
      { 
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 3600 } }
        )
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

export async function getAllPosts(): Promise<WPPost[]> {
  try {
    // GCP 環境：大幅減少資料量避免超時，只獲取必要欄位
    const perPage = isCloudRun ? 15 : 30;
    
    const response = await fetchWithRetry(
      `${API_BASE}/posts?per_page=${perPage}&status=publish&_fields=id,slug,title,date`,
      { 
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 7200 } }
        )
      }
    );
    
    return await response.json();
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP getAllPosts failed:', {
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
      `${API_BASE}/categories?per_page=50&hide_empty=true&_fields=id,name,slug,count`,
      { 
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 7200 } }
        )
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
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 3600 } }
        )
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
    
    const response = await fetchWithRetry(
      `${API_BASE}/posts?categories=${categoryId}&per_page=${actualPerPage}&page=${page}&orderby=${orderBy}&order=${order}&_embed&status=publish`,
      { 
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 3600 } }
        )
      }
    );
    
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
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 3600 } }
        )
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
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 7200 } }
        )
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

export async function getTags(): Promise<WPTag[]> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE}/tags?per_page=50&hide_empty=true&_fields=id,name,slug,count`,
      { 
        // 修復：只使用一種快取策略
        ...(isCloudRun 
          ? { cache: 'no-store' }
          : { next: { revalidate: 7200 } }
        )
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
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default-post-image.svg';
}

export function getCategoryNames(post: WPPost): string[] {
  const categories = post._embedded?.['wp:term']?.[0] || [];
  return categories.map(cat => cat.name);
}

export function getTagNames(post: WPPost): string[] {
  const tags = post._embedded?.['wp:term']?.[1] || [];
  return tags.map(tag => tag.name);
} 