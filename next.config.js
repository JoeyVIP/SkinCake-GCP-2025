/** @type {import('next').NextConfig} */
const nextConfig = {
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'skincake.online',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'https://skincake.online/wp-json/wp/v2',
    // The FRONTEND_DOMAIN should ideally be set in your production environment variables
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || 'http://localhost:3000'
  }
};

module.exports = nextConfig; 