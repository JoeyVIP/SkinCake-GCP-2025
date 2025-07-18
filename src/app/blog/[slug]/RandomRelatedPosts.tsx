'use client';

import { useEffect, useState } from 'react';
import { WPPost } from '@/lib/wordpress-api';
import ArticleCard from '@/components/features/ArticleCard';

interface RandomRelatedPostsProps {
  initialPosts: WPPost[];
  excludeId: number;
}

export default function RandomRelatedPosts({ initialPosts, excludeId }: RandomRelatedPostsProps) {
  const [posts, setPosts] = useState<WPPost[]>(initialPosts.slice(0, 6));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 只在客戶端進行隨機化
    if (typeof window !== 'undefined' && initialPosts.length > 0) {
      // 複製數組並隨機排序
      const shuffled = [...initialPosts];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setPosts(shuffled.slice(0, 6));
    }
  }, [initialPosts]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto mb-12 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">推薦文章</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
} 