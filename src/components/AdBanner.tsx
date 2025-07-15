import React from 'react';
import Link from 'next/link';

export default function AdBanner() {
  return (
    <div className="max-w-[1080px] mx-auto rounded-xl bg-gradient-to-r from-[#FFA4B3] to-[#FF8599] overflow-hidden relative my-12">
      {/* 裝飾背景元素 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/10 transform rotate-12 translate-x-[-10%] translate-y-[-50%] w-[120%] h-[200%]"></div>
        <div className="absolute inset-0 bg-white/5 transform rotate-45 translate-x-[10%] translate-y-[20%] w-[120%] h-[200%]"></div>
      </div>
      {/* 內容區域 */}
      <div className="relative px-4 py-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          SkinCake 肌膚地圖
        </h2>
        <p className="text-lg md:text-xl text-white/90">
          探索最新的美肌秘訣
        </p>
        <Link 
          href="https://www.instagram.com/skincake_tw/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-6 px-8 py-3 bg-white text-[#FFA4B3] rounded-full font-medium hover:bg-[#FFE5E9] transition-colors"
        >
          立即體驗
        </Link>
      </div>
    </div>
  );
} 