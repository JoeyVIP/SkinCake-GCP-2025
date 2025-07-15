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

export async function getRecentPosts(count: number = 6): Promise<WPPost[]> {
  try {
    const response = await fetch(
      `${API_BASE}/posts?per_page=${count}&_embed&status=publish`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const response = await fetch(
      `${API_BASE}/posts?slug=${slug}&_embed&status=publish`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getAllPosts(): Promise<WPPost[]> {
  try {
    // 減少per_page以避免快取錯誤，並且不嵌入_embed資料
    const response = await fetch(
      `${API_BASE}/posts?per_page=50&status=publish&_fields=id,slug,title,date`,
      { next: { revalidate: 7200 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch all posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    const response = await fetch(
      `${API_BASE}/categories?per_page=100&hide_empty=true`,
      { next: { revalidate: 7200 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getPostsByCategory(categoryId: number, count: number = 10): Promise<WPPost[]> {
  try {
    const response = await fetch(
      `${API_BASE}/posts?categories=${categoryId}&per_page=${count}&_embed&status=publish`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts by category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts by category:', error);
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
    const response = await fetch(
      `${API_BASE}/posts?categories=${categoryId}&per_page=${perPage}&page=${page}&orderby=${orderBy}&order=${order}&_embed&status=publish`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts by category: ${response.statusText}`);
    }
    
    const posts = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const total = parseInt(response.headers.get('X-WP-Total') || '0');
    
    return { posts, totalPages, total };
  } catch (error) {
    console.error('Error fetching posts by category with pagination:', error);
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
    console.error('Error fetching related categories:', error);
    return [];
  }
}

export async function getPostsByTag(tagId: number, count: number = 10): Promise<WPPost[]> {
  try {
    const response = await fetch(
      `${API_BASE}/posts?tags=${tagId}&per_page=${count}&_embed&status=publish`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts by tag: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}

export async function getCategoryById(categoryId: number): Promise<WPCategory | null> {
  try {
    const response = await fetch(
      `${API_BASE}/categories/${categoryId}`,
      { next: { revalidate: 7200 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function getTags(): Promise<WPTag[]> {
  try {
    const response = await fetch(
      `${API_BASE}/tags?per_page=100&hide_empty=true`,
      { next: { revalidate: 7200 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
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