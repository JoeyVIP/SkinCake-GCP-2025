'use client';

import { useEffect } from 'react';

export default function LazyCSS() {
  useEffect(() => {
    // 延遲載入完整的 Tailwind CSS
    const loadFullCSS = () => {
      const existingLink = document.querySelector('link[href*="globals.css"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/_next/static/css/app/globals.css';
        link.media = 'all';
        document.head.appendChild(link);
      }
    };

    // 在用戶互動或 2 秒後載入
    let loaded = false;

    const loadCSS = () => {
      if (!loaded) {
        loaded = true;
        loadFullCSS();
        document.removeEventListener('scroll', loadCSS);
        document.removeEventListener('click', loadCSS);
        document.removeEventListener('touchstart', loadCSS);
        document.removeEventListener('mousemove', loadCSS);
      }
    };

    // 註冊事件監聽器（使用正確的類型）
    const options = { passive: true } as AddEventListenerOptions;
    document.addEventListener('scroll', loadCSS, options);
    document.addEventListener('click', loadCSS, options);
    document.addEventListener('touchstart', loadCSS, options);
    document.addEventListener('mousemove', loadCSS, options);

    // 2 秒後自動載入
    const timeout = setTimeout(loadCSS, 2000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('scroll', loadCSS);
      document.removeEventListener('click', loadCSS);
      document.removeEventListener('touchstart', loadCSS);
      document.removeEventListener('mousemove', loadCSS);
    };
  }, []);

  return null;
} 