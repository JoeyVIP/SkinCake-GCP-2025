'use client';

import { useState, useEffect } from 'react';
import { WPPost, getAllPosts } from '@/lib/wordpress-api';
import ArticleCard from '@/components/features/ArticleCard';

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setPosts([]);
      setSearched(false);
      return;
    }

    const searchPosts = async () => {
      setLoading(true);
      try {
        const allPosts = await getAllPosts();
        const filteredPosts = allPosts.filter(post => {
          const title = post.title.rendered.toLowerCase();
          const content = post.content.rendered.toLowerCase();
          const excerpt = post.excerpt.rendered.toLowerCase();
          const searchTerm = query.toLowerCase();
          
          return title.includes(searchTerm) || 
                 content.includes(searchTerm) || 
                 excerpt.includes(searchTerm);
        });
        
        setPosts(filteredPosts);
        setSearched(true);
      } catch (error) {
        console.error('Search error:', error);
        setPosts([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    };

    searchPosts();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">請輸入搜尋關鍵字</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (searched && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">沒有找到相關文章</p>
        <p className="text-sm text-gray-400 mt-2">
          試試其他關鍵字或瀏覽我們的分類頁面
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">
        找到 {posts.length} 篇相關文章
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
} 