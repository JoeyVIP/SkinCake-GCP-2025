'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 追蹤頁面瀏覽
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // 發送頁面瀏覽事件
      window.gtag('config', 'G-CS0NRJ05FE', {
        page_path: url,
        debug_mode: process.env.NODE_ENV === 'development', // 開發環境啟用除錯
      });
      
      // 在開發環境中記錄
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 GA Page View:', url);
      }
    }
  }, [pathname, searchParams]);
  
  // 提供事件追蹤方法
  useEffect(() => {
    // 為網站添加全域事件追蹤功能
    (window as any).trackEvent = (eventName: string, parameters?: any) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', eventName, parameters);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 GA Event:', eventName, parameters);
        }
      }
    };
    
    // 追蹤外部連結點擊
    const handleOutboundClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.startsWith(window.location.origin)) {
        window.gtag('event', 'click', {
          event_category: 'outbound',
          event_label: link.href,
          transport_type: 'beacon',
        });
      }
    };
    
    document.addEventListener('click', handleOutboundClick);
    
    return () => {
      document.removeEventListener('click', handleOutboundClick);
    };
  }, []);
  
  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CS0NRJ05FE"
        strategy="afterInteractive"
      />
      <Script 
        id="google-analytics" 
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // 基本配置
            gtag('config', 'G-CS0NRJ05FE', {
              send_page_view: false, // 我們手動發送頁面瀏覽
              debug_mode: ${process.env.NODE_ENV === 'development'}, // 開發環境除錯
            });
            
            // 增強型測量功能
            gtag('event', 'page_view', {
              page_location: window.location.href,
              page_title: document.title,
              page_referrer: document.referrer,
            });
          `
        }}
      />

      {/* Facebook Pixel Code */}
      <Script 
        id="facebook-pixel" 
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
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
          `
        }}
      />
      
      {/* Google Analytics 除錯工具 (僅在開發環境) */}
      {process.env.NODE_ENV === 'development' && (
        <Script 
          id="ga-debug" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // GA 除錯輔助工具
              window.gaDebug = {
                checkStatus: function() {
                  console.log('🔍 GA Status Check:');
                  console.log('- gtag defined:', typeof window.gtag !== 'undefined');
                  console.log('- dataLayer:', window.dataLayer);
                  console.log('- dataLayer length:', window.dataLayer ? window.dataLayer.length : 0);
                },
                testEvent: function() {
                  window.gtag('event', 'test_event', {
                    event_category: 'debug',
                    event_label: 'manual_test',
                    value: 1
                  });
                  console.log('✅ Test event sent!');
                }
              };
              
              // 3秒後自動檢查狀態
              setTimeout(() => {
                window.gaDebug.checkStatus();
              }, 3000);
            `
          }}
        />
      )}
    </>
  );
} 