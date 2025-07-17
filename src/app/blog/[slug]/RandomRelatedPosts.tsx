'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRandomPosts, getFeaturedImageUrl, getCategoryNames, WPPost } from '@/lib/wordpress-api';

interface RandomRelatedPostsProps {
  initialPosts: WPPost[];
  excludeId: number;
}

export default function RandomRelatedPosts({ initialPosts, excludeId }: RandomRelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<WPPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  const refreshRelatedPosts = async () => {
    setLoading(true);
    try {
      // 加入隨機延遲和時間戳確保每次獲取的隨機文章都不同
      const randomDelay = Math.floor(Math.random() * 200) + 50;
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      
      const timestamp = Date.now();
      console.log(`Fetching random posts at ${timestamp} for post ${excludeId}`);
      
      const newRelatedPosts = await getRandomPosts(6, excludeId);
      setRelatedPosts(newRelatedPosts);
    } catch (error) {
      console.error('Error refreshing related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">相關文章推薦</h2>
        <button
          onClick={refreshRelatedPosts}
          disabled={loading}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
          title="重新整理相關文章"
        >
          <svg 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? '載入中...' : '換一批'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.slice(0, 6).map((relatedPost) => {
          const categories = getCategoryNames(relatedPost);
          return (
            <Link
              key={relatedPost.id}
              href={`/blog/${relatedPost.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <img 
                  src={getFeaturedImageUrl(relatedPost)} 
                  alt={relatedPost.title.rendered} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  {/* 分類標籤 */}
                  {categories.length > 0 && (
                    <span className="inline-block px-2 py-0.5 bg-[#FFE5E9] text-[#FF8599] rounded-full text-xs mb-2">
                      {categories[0]}
                    </span>
                  )}
                  
                  <h3 className="font-medium text-gray-800 leading-snug hover:text-pink-500 transition-colors">
                    {relatedPost.title.rendered}
                  </h3>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
} 