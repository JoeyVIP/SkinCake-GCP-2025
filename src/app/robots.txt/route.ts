export async function GET() {
  const isVipEnvironment = process.env.FRONTEND_DOMAIN?.includes('.vip');
  
  if (isVipEnvironment) {
    // 開發環境 - 禁止所有機器人索引
    return new Response(
      `User-agent: *
Disallow: /

# 這是開發環境，禁止搜尋引擎索引
# Development environment - no indexing allowed
`,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }

  // 生產環境 - 允許索引但排除管理和 API 路徑
  return new Response(
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# 網站地圖
Sitemap: ${process.env.FRONTEND_DOMAIN || 'https://skincake.tw'}/sitemap.xml
Sitemap: ${process.env.FRONTEND_DOMAIN || 'https://skincake.tw'}/server-sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
} 