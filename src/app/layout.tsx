import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";
import LazyCSS from "@/components/LazyCSS";

const noto_sans_tc = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap', // 優化字體載入，防止文字閃爍
  preload: true, // 預載字體
});

export const metadata: Metadata = {
  title: "SkinCake 肌膚蛋糕 - 韓國美容旅遊資訊",
  description: "探索最新的韓國美容、時尚、旅遊和美食資訊。SkinCake 為您提供最深入的在地報導。",
  keywords: "韓國美容,韓國旅遊,韓國購物,韓國美食,首爾旅遊,韓國保養品,韓國化妝品",
  authors: [{ name: "SkinCake Team" }],
  creator: "SkinCake",
  publisher: "SkinCake",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: process.env.FRONTEND_DOMAIN?.includes('.vip') ? {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  } : {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/images/favicon-120x120.png', sizes: '120x120', type: 'image/png' },
    ],
    shortcut: '/images/favicon-32x32.png',
  },
  verification: {
    google: 'YOUR_ACTUAL_GOOGLE_VERIFICATION_CODE',
    other: {
      'facebook-domain-verification': 'YOUR_ACTUAL_FACEBOOK_VERIFICATION_CODE',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://skincake.tw',
    siteName: 'SkinCake 肌膚蛋糕',
    title: 'SkinCake 肌膚蛋糕 - 韓國美容旅遊資訊',
    description: '探索最新的韓國美容、時尚、旅遊和美食資訊。SkinCake 為您提供最深入的在地報導。',
    images: [
      {
        url: '/images/main_skincake_logo.png',
        width: 1200,
        height: 630,
        alt: 'SkinCake 肌膚蛋糕',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@skincake',
    creator: '@skincake',
    title: 'SkinCake 肌膚蛋糕 - 韓國美容旅遊資訊',
    description: '探索最新的韓國美容、時尚、旅遊和美食資訊。SkinCake 為您提供最深入的在地報導。',
    images: ['/images/main_skincake_logo.png'],
  },
  alternates: {
    canonical: 'https://skincake.tw',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        {/* 關鍵 CSS 內聯 - 優先載入 */}
        <style dangerouslySetInnerHTML={{
          __html: `
/* 基礎重置與佈局 */
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
*{margin:0}
html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
body{margin:0;line-height:inherit}
img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}
img,video{max-width:100%;height:auto}

/* 字體載入最佳化 */
@font-display:swap;

/* 重要佈局 */
.container{width:100%}
@media (min-width:640px){.container{max-width:640px}}
@media (min-width:768px){.container{max-width:768px}}
@media (min-width:1024px){.container{max-width:1024px}}
@media (min-width:1280px){.container{max-width:1280px}}

/* 顏色系統 */
.bg-white{background-color:#fff}
.bg-gray-50{background-color:#f9fafb}
.text-gray-800{color:#1f2937}
.text-gray-500{color:#6b7280}

/* 關鍵網格 */
.grid{display:grid}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
@media (min-width:768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1024px){.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}

/* 關鍵 flex */
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.justify-between{justify-content:space-between}

/* 間距 */
.p-4{padding:1rem}
.px-4{padding-left:1rem;padding-right:1rem}
.py-8{padding-top:2rem;padding-bottom:2rem}
.mb-8{margin-bottom:2rem}
.gap-6{gap:1.5rem}

/* 關鍵圓角 */
.rounded-lg{border-radius:0.5rem}

/* 關鍵陰影 */
.shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}

/* 首屏重要樣式 */
.min-h-screen{min-height:100vh}
.aspect-video{aspect-ratio:16/9}
.aspect-square{aspect-ratio:1/1}

/* 粉色主題色 */
.bg-\\[\\#FFF9FA\\]{background-color:#FFF9FA}
.bg-\\[\\#FFE5E9\\]{background-color:#FFE5E9}
.text-\\[\\#FF8599\\]{color:#FF8599}
.text-\\[\\#FFB7C5\\]{color:#FFB7C5}

/* 響應式隱藏/顯示 */
.hidden{display:none}
@media (min-width:768px){.md\\:block{display:block}}
@media (min-width:1024px){.lg\\:flex{display:flex}}

/* 過渡效果 */
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
          `
        }} />

        {/* DNS 預連接優化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i0.wp.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
      </head>
      
      <body className={noto_sans_tc.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* 延遲載入完整 CSS */}
        <LazyCSS />
        
        {/* Analytics 延遲載入 */}
        <Analytics />
      </body>
    </html>
  );
} 