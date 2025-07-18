'use client';

import Link from 'next/link';

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface CategoryKeywordsProps {
  categories: WPCategory[];
  currentCategorySlug: string;
}

export default function CategoryKeywords({ 
  categories, 
  currentCategorySlug 
}: CategoryKeywordsProps) {
  // 安全檢查
  if (!categories || !Array.isArray(categories)) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* 標題區塊 - 居中設計 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          熱門旅遊關鍵字
        </h1>
        <div className="w-16 h-1 bg-[#FFA4B3] mx-auto rounded-full"></div>
      </div>
      
      {/* 分類標籤 - 橢圓形按鈕，居中排列 */}
      <div className="flex flex-wrap justify-center gap-3 max-w-[1080px] mx-auto">
        {categories.map((category) => {
          const isActive = currentCategorySlug === category.slug;
          
          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`
                inline-block px-6 py-2.5 rounded-full text-sm font-medium
                transition-all duration-300 hover:scale-105
                ${isActive
                  ? 'bg-[#FF8599] text-white shadow-md' 
                  : 'bg-[#FFE5E9] text-[#FF8599] hover:bg-[#FFB7C5] hover:text-white'
                }
              `}
            >
              {category.name}
              <span className="ml-1 opacity-80">
                ({category.count})
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
} 