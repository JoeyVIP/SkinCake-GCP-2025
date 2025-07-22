'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// 全域類型宣告
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    gaDebug: () => void;
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState('');
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);

  // 延遲載入 Analytics
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let loaded = false;

    const loadAnalytics = () => {
      if (loaded) return;
      loaded = true;

      // 載入 Google Analytics
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-CS0NRJ05FE';
      document.head.appendChild(gaScript);

      // 初始化 GA
      const gaInitScript = document.createElement('script');
      gaInitScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-CS0NRJ05FE', {
          page_title: document.title,
          debug_mode: ${process.env.NODE_ENV === 'development'}
        });

        // GA Debug 函數
        window.gaDebug = function() {
          console.log('🔍 GA Debug 資訊:');
          console.log('- DataLayer 長度:', window.dataLayer?.length || 0);
          console.log('- 最近 5 個事件:', window.dataLayer?.slice(-5) || []);
          console.log('- GA 載入狀態:', typeof window.gtag !== 'undefined' ? '✅ 已載入' : '❌ 未載入');
          
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'debug_test', {
              debug_mode: true,
              timestamp: new Date().toISOString()
            });
            console.log('✅ 發送測試事件成功');
          }
        };

        // 自動外鏈追蹤
        document.addEventListener('click', function(e) {
          const link = e.target.closest('a');
          if (link && link.hostname !== window.location.hostname) {
            if (typeof window.gtag !== 'undefined') {
              window.gtag('event', 'click', {
                event_category: 'outbound',
                event_label: link.href,
                transport_type: 'beacon'
              });
            }
          }
        });
      `;
      document.head.appendChild(gaInitScript);

      // 載入 Facebook Pixel
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
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
      `;
      document.head.appendChild(fbScript);

      setAnalyticsLoaded(true);

      // 清理事件監聽器
      const events = ['scroll', 'click', 'touchstart', 'mousemove'];
      events.forEach(event => 
        document.removeEventListener(event, loadAnalytics)
      );
    };

    // 用戶互動時載入
    const events = ['scroll', 'click', 'touchstart', 'mousemove'];
    const options = { passive: true, once: true };
    events.forEach(event => 
      document.addEventListener(event, loadAnalytics, options)
    );

    // 3 秒後自動載入
    timeout = setTimeout(loadAnalytics, 3000);

    return () => {
      clearTimeout(timeout);
      events.forEach(event => 
        document.removeEventListener(event, loadAnalytics)
      );
    };
  }, []);

  // 處理搜索參數（客戶端）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(window.location.search);
    }
  }, [pathname]);

  // 頁面瀏覽追蹤
  useEffect(() => {
    if (analyticsLoaded && typeof window.gtag !== 'undefined') {
      const url = pathname + searchParams;
      window.gtag('config', 'G-CS0NRJ05FE', {
        page_path: url,
        debug_mode: process.env.NODE_ENV === 'development'
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 GA Page View:', url);
      }
    }
  }, [analyticsLoaded, pathname, searchParams]);

  return null;
} 