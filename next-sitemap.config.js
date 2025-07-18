/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://skincake.tw',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  trailingSlash: false,
  generateIndexSitemap: true,
  
  // 排除不需要索引的路徑
  exclude: [
    '/api/*',
    '/admin/*',
    '/*.json',
    '/404',
    '/500',
    '/_app',
    '/_document',
    '/_error',
    '/server-sitemap.xml',
  ],
  
  // 額外的動態 sitemap
  additionalSitemaps: [
    'https://skincake.tw/server-sitemap.xml',
  ],
  
  // robots.txt 配置
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/static/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      }
    ],
    additionalSitemaps: [
      'https://skincake.tw/sitemap.xml',
      'https://skincake.tw/server-sitemap.xml',
    ],
  },
  
  // 轉換函數 - 根據路徑類型設定不同的優先級
  transform: async (config, path) => {
    // 首頁最高優先級
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }
    
    // 文章頁面高優先級
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    // 分類頁面中等優先級
    if (path.startsWith('/category/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    // 搜尋頁面較低優先級
    if (path.startsWith('/search')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      }
    }
    
    // 其他頁面使用默認設定
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
} 