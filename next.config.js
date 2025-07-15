/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生產環境需要 standalone 輸出
  output: 'standalone',
  
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors. It's recommended to remove this once
    // all type errors are resolved.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // 允許本地圖片和遠端圖片
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'skincake.online',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-flare.qdm.cloud',
        port: '',
        pathname: '/**',
      }
    ],
    // 確保本地圖片可以載入
    unoptimized: false,
    // 支援的圖片格式
    formats: ['image/avif', 'image/webp'],
    // 最小快取時間
    minimumCacheTTL: 60,
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'https://skincake.online/wp-json/wp/v2',
    // The FRONTEND_DOMAIN should ideally be set in your production environment variables
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || 'http://localhost:3000'
  },
  // 添加快取頭設定
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 