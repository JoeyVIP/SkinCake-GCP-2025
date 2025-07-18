'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// 定義 gtag 類型
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: {
        page_path?: string;
        debug_mode?: boolean;
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
    gaDebug: {
      checkStatus: () => void;
      testEvent: () => void;
    };
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<string>('');
  
  // 使用 useEffect 在 client-side 獲取 searchParams，避免 Suspense 問題
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(window.location.search);
    }
  }, []);
  
  // 追蹤頁面瀏覽
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      const url = pathname + searchParams;
      
      // 發送頁面瀏覽事件
      window.gtag('config', 'G-CS0NRJ05FE', {
        page_path: url,
        debug_mode: process.env.NODE_ENV === 'development'
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 GA Page View:', url);
      }
    }
  }, [pathname, searchParams]);

  // 設定 GA 除錯工具
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gaDebug = {
        checkStatus: () => {
          console.log('🔍 GA Debug Status:', {
            gtag: typeof window.gtag !== 'undefined',
            dataLayer: window.dataLayer?.length || 0,
            lastEvents: window.dataLayer?.slice(-5) || []
          });
        },
        testEvent: () => {
          if (window.gtag) {
            window.gtag('event', 'debug_test', {
              event_category: 'debug',
              event_label: 'manual_test'
            });
            console.log('✅ Test event sent');
          }
        }
      };
    }
  }, []);

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CS0NRJ05FE"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CS0NRJ05FE', {
            debug_mode: ${process.env.NODE_ENV === 'development'}
          });

          // 追蹤外部連結點擊
          document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
              gtag('event', 'click', {
                event_category: 'outbound',
                event_label: link.href,
                transport_type: 'beacon'
              });
              
              if (${process.env.NODE_ENV === 'development'}) {
                console.log('📊 GA Outbound Click:', link.href);
              }
            }
          });
        `}
      </Script>

      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1879313576190232');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1879313576190232&ev=PageView&noscript=1"
        />
      </noscript>
    </>
  );
} 