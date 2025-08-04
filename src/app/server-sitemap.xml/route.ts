import { getServerSideSitemap } from 'next-sitemap'
import { getAllPosts, getCategories } from '@/lib/wordpress-api'

export async function GET(request: Request) {
  const baseUrl = process.env.FRONTEND_DOMAIN || 'https://skincake.tw'
  
  try {
    let allPosts: any[] = []
    let categories: any[] = []
    
    // 嘗試獲取文章，如果失敗則返回基本 sitemap
    try {
      // 限制在 build 時的請求
      const maxPosts = process.env.NEXT_PHASE === 'phase-production-build' ? 100 : 500
    let page = 1
    let hasMore = true
    
      while (hasMore && allPosts.length < maxPosts) {
      const posts = await getAllPosts(page, 50)
      if (posts.length === 0) {
        hasMore = false
      } else {
        allPosts.push(...posts)
        page++
      }
      }
    } catch (error) {
      console.warn('Failed to fetch posts for sitemap:', error)
      // 如果獲取文章失敗，繼續生成基本 sitemap
    }
    
    // 嘗試獲取分類
    try {
      categories = await getCategories()
    } catch (error) {
      console.warn('Failed to fetch categories for sitemap:', error)
      // 如果獲取分類失敗，使用空陣列
      categories = []
    }
    
    // 生成文章 URLs
    const postUrls = allPosts.map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: new Date(post.modified || post.date).toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.9,
    }))
    
    // 生成分類 URLs
    const categoryUrls = categories
      .map((category) => ({
        loc: `${baseUrl}/category/${encodeURIComponent(category.slug)}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly' as const,
        priority: 0.8,
      }))
    
    // 添加其他重要頁面
    const staticUrls = [
      {
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily' as const,
        priority: 1.0,
      },
      {
        loc: `${baseUrl}/search`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly' as const,
        priority: 0.5,
      },
    ]
    
    // 合併所有 URLs
    const allUrls = [...staticUrls, ...postUrls, ...categoryUrls]
    
    // 返回 sitemap
    return getServerSideSitemap(allUrls)
  } catch (error) {
    console.error('Error generating server sitemap:', error)
    
    // 返回基本的 sitemap
    return getServerSideSitemap([
      {
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0,
      },
    ])
  }
} 