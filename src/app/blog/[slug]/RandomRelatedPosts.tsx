'use client';

import { useEffect, useState } from 'react';
import { WPPost } from '@/lib/wordpress-api';
import ArticleCard from '@/components/features/ArticleCard';

interface RandomRelatedPostsProps {
  excludeId: number;
}

export default function RandomRelatedPosts({ excludeId }: RandomRelatedPostsProps) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/random-related?exclude=${excludeId}&count=6`, {
          cache: 'no-store',
        });
        const data: WPPost[] = await res.json();
        setPosts(data);
    } catch (error) {
        console.error('Failed to fetch random related posts:', error);
    } finally {
        setIsLoading(false);
    }
  };

    fetchRandomPosts();
  }, [excludeId]);

  if (!isLoading && posts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto mb-12 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">推薦文章</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
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