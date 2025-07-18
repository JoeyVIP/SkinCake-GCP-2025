import { getServerSideSitemap } from 'next-sitemap'
import { getAllPosts, getCategories } from '@/lib/wordpress-api'

export async function GET(request: Request) {
  const baseUrl = process.env.SITE_URL || 'https://skincake.tw'
  
  try {
    // 獲取所有文章（分批獲取以避免內存問題）
    const allPosts: any[] = []
    let page = 1
    let hasMore = true
    
    while (hasMore) {
      const posts = await getAllPosts(page, 50)
      if (posts.length === 0) {
        hasMore = false
      } else {
        allPosts.push(...posts)
        page++
      }
      
      // 限制最多獲取 500 篇文章
      if (allPosts.length >= 500) {
        break
      }
    }
    
    // 生成文章 URLs
    const postUrls = allPosts.map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: new Date(post.modified || post.date).toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.9,
    }))
    
    // 獲取所有分類
    const categories = await getCategories()
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