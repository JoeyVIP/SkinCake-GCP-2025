'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WPPost, WPCategory } from '@/lib/wordpress-api';

interface CategoryArticleGridProps {
  posts: WPPost[];
  currentCategory: WPCategory;
}

// 輔助函數：獲取特色圖片 URL
function getFeaturedImageUrl(post: WPPost): string {
  const defaultImage = '/images/default-post-image.svg';
  
  if (!post._embedded?.['wp:featuredmedia']?.[0]) {
    return defaultImage;
  }

  const media = post._embedded['wp:featuredmedia'][0];
  return media.source_url || defaultImage;
}

// 輔助函數：格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
}

// 輔助函數：解碼 HTML 實體
function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export default function CategoryArticleGrid({ 
  posts, 
  currentCategory 
}: CategoryArticleGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">目前沒有文章</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {posts.map((post) => (
        <Link 
          key={post.id} 
          href={`/blog/${post.slug}`}
          className="group block"
        >
          <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            {/* 16:9 圖片 */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={getFeaturedImageUrl(post)}
                alt={post.title.rendered}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            
            {/* 內容區 - 匹配線上版樣式 */}
            <div className="p-4">
              {/* 分類標籤和日期 - 同一行 */}
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-2 py-1 bg-[#FFE5E9] text-[#FF8599] text-xs rounded-full font-medium">
                  {currentCategory.name}
                </span>
                <div className="text-xs text-gray-500">
                  {formatDate(post.date)}
                </div>
              </div>
              
              {/* 標題 */}
              <h2 className="font-medium text-base text-gray-800 leading-tight line-clamp-2 group-hover:text-[#FF8599] transition-colors">
                {decodeHtml(post.title.rendered)}
              </h2>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
} 