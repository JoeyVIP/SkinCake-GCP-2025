export interface Post {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          large?: { source_url: string };
          medium?: { source_url: string };
        };
      };
    }>;
    'wp:term'?: Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>[];
  };
}

const API_BASE_URL = process.env.WORDPRESS_API_URL || 'https://skincake.online/wp-json/wp/v2';

// 由於 Next.js 的 IncrementalCache 對單筆請求上限為 2 MB，
// perPage 100 可能導致回傳 JSON 過大而拋出「items over 2MB can not be cached」警告。
// 將 perPage 降至 50 並完全禁用快取，既能避免警告，也不影響開發體驗。

export async function getAllPosts(page = 1, perPage = 50): Promise<Post[]> {
  const res = await fetch(
    `${API_BASE_URL}/posts?per_page=${perPage}&page=${page}&_embed`,
    {
      // 關閉 Next.js 內建快取，避免 2 MB 限制錯誤
      cache: 'no-store'
    }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

// 獲取單篇文章
export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(
    `${API_BASE_URL}/posts?slug=${slug}&_embed`,
    {
      cache: 'no-store'
    }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  
  const posts = await res.json();
  
  if (!posts || posts.length === 0) {
    throw new Error('Post not found');
  }
  
  return posts[0];
}

// 獲取相關文章
export async function getRelatedPosts(excludeId: number, limit = 6): Promise<Post[]> {
  const res = await fetch(
    `${API_BASE_URL}/posts?per_page=${limit}&exclude=${excludeId}&_embed`,
    {
      cache: 'no-store'
    }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch related posts');
  }
  
  return res.json();
}

// 獲取文章分類
export async function getCategories() {
  const res = await fetch(
    `${API_BASE_URL}/categories`,
    {
      cache: 'no-store'
    }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  return res.json();
}

// 輔助函數：獲取特色圖片 URL
export function getFeaturedImageUrl(post: Post): string {
  const defaultImage = '/images/default-post-image.svg'; // 使用 SVG 預設圖片
  
  if (!post._embedded?.['wp:featuredmedia']?.[0]) {
    return defaultImage;
  }

  const media = post._embedded['wp:featuredmedia'][0];
  return media.source_url ||
         media.media_details?.sizes?.full?.source_url ||
         media.media_details?.sizes?.large?.source_url ||
         media.media_details?.sizes?.medium?.source_url ||
         defaultImage;
}

// 輔助函數：獲取文章分類名稱
export function getCategoryName(post: Post): string {
  const terms = post._embedded?.['wp:term']?.flat() || [];
  const category = terms.find(term => term.taxonomy === 'category');
  return category?.name || '未分類';
} 