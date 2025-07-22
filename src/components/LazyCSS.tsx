'use client';

import { useEffect } from 'react';

export default function LazyCSS() {
  useEffect(() => {
    // 取得 Next 生成的實際 CSS 路徑並延遲載入
    const loadFullCSS = () => {
      const existingNextLink = document.querySelector('link[data-n-href]') as HTMLLinkElement | null;
      if (existingNextLink) {
        const href = existingNextLink.href;
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.media = 'all';
          document.head.appendChild(link);
        }
      }
    };

    let loaded = false;
    const loadCSS = () => {
      if (!loaded) {
        loaded = true;
        loadFullCSS();
        ['scroll', 'click', 'touchstart', 'mousemove'].forEach(evt => {
          document.removeEventListener(evt, loadCSS);
        });
      }
    };

    // 使用用戶互動或 2 秒後載入
    ['scroll', 'click', 'touchstart', 'mousemove'].forEach(evt => {
      document.addEventListener(evt, loadCSS, { passive: true });
    });

    const timeout = setTimeout(loadCSS, 2000);

    return () => {
      clearTimeout(timeout);
      ['scroll', 'click', 'touchstart', 'mousemove'].forEach(evt => {
        document.removeEventListener(evt, loadCSS);
      });
    };
  }, []);

  return null;
} 