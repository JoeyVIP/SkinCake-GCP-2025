import React from 'react';
import Carousel from '@/components/Carousel';
import CategoryCards from '@/components/CategoryCards';
import TagCloud from '@/components/TagCloud';
import AdBanner from '@/components/AdBanner';
import CakeNews from "@/components/features/CakeNews";
import BackToTop from '@/components/BackToTop';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 輪播圖 */}
      <section className="mb-12">
        <Carousel />
      </section>

      {/* SkinCake 精選推薦 */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
          SkinCake 精選推薦
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4"></div>
        </h2>
        <CategoryCards />
      </section>

      {/* 廣告橫幅 */}
      <section className="mb-12">
        <AdBanner />
      </section>

      {/* 蛋糕報報 */}
      <section className="container mx-auto px-4 mb-12">
        <CakeNews />
      </section>

      {/* 從地區開始探索 */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
          從地區開始探索
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4"></div>
        </h2>
        <TagCloud />
      </section>

      {/* 偷偷推薦給你 */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            偷偷推薦給你
            <div className="w-20 h-1 bg-pink-500 mx-auto mt-4"></div>
          </h2>
          {/* 這裡之後會添加推薦文章組件 */}
          <div className="text-center text-gray-500 py-8">
            推薦內容載入中...
          </div>
        </div>
      </section>

      <BackToTop />
    </div>
  );
} 