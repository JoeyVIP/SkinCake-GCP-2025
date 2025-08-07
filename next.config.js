/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生產環境需要 standalone 輸出
  output: 'standalone',
  
  // 統一 URL 格式，避免重定向問題
  trailingSlash: false,
  
  // 🔧 修復：防止 Next.js 自動編碼中文 URL 造成重定向
  skipMiddlewareUrlNormalize: true,
  
  // GCP Cloud Run 環境檢測
  experimental: {
    // 增加建置工作器的記憶體限制
    workerThreads: false,
  },
  
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
  
  // 為 GCP 環境限制並發生的頁面數量
  generateBuildId: async () => {
    return process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'development'
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
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/skincake.online/**',
      }
    ],
    // 🔧 修復：GCP 環境完全禁用圖片優化避免 400 錯誤
    unoptimized: process.env.K_SERVICE !== undefined || process.env.NODE_ENV === 'production',
    // 支援的圖片格式
    formats: ['image/avif', 'image/webp'],
    // 圖片載入器配置 - GCP 環境使用自定義載入器
    ...(process.env.K_SERVICE !== undefined ? {
      loader: 'custom',
      loaderFile: './src/lib/image-loader.js'
    } : {}),
    // 最小快取時間
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'https://skincake.online/wp-json/wp/v2',
    // The FRONTEND_DOMAIN should ideally be set in your production environment variables
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || 'https://skincake.tw'
  },
  
  // 優化靜態資源快取
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
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // 🔧 修復：防止中文 URL 重定向問題，確保 Google 正確索引
  async redirects() {
    return [];
  },
  
  // 優化 webpack 配置以避免記憶體問題
  webpack: (config, { dev, isServer }) => {
    // GCP 環境：優化記憶體使用
    if (process.env.K_SERVICE !== undefined) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          maxSize: 200000, // 限制 chunk 大小
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 