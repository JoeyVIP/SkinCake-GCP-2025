import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";

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
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://skincake.tw',
    siteName: 'SkinCake 肌膚蛋糕',
    title: 'SkinCake 肌膚蛋糕 - 韓國美容旅遊資訊',
    description: '探索最新的韓國美容、時尚、旅遊和美食資訊。SkinCake 為您提供最深入的在地報導。',
    images: [
      {
        url: 'https://skincake.tw/images/main_skincake_logo.png',
        width: 1200,
        height: 630,
        alt: 'SkinCake 肌膚蛋糕',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkinCake 肌膚蛋糕 - 韓國美容旅遊資訊',
    description: '探索最新的韓國美容、時尚、旅遊和美食資訊。',
    images: ['https://skincake.tw/images/main_skincake_logo.png'],
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
        {/* 預連接到重要資源 */}
        <link rel="preconnect" href="https://skincake.online" />
        <link rel="dns-prefetch" href="https://skincake.online" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 預載關鍵圖片 */}
        <link rel="preload" href="/images/main_skincake_logo.png" as="image" />
        
        {/* 網站驗證 - 請替換為你的實際驗證碼 */}
        <meta name="google-site-verification" content="YOUR_ACTUAL_GOOGLE_VERIFICATION_CODE" />
        <meta name="facebook-domain-verification" content="YOUR_ACTUAL_FACEBOOK_VERIFICATION_CODE" />
      </head>
      <body className={`${noto_sans_tc.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        {/* Google Analytics 和其他追蹤腳本 */}
        <Analytics />
      </body>
    </html>
  );
} 