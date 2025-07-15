'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  originalId: number;
  title: string;
  slug: string;
  featuredImage: string;
  date: string;
  tag: string;
}

export default function WordPressPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const postsPerPage = 6;

  const loadPosts = useCallback(async (page: number) => {
    if (isLoading || !hasMorePosts) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://skincake.online/wp-json/wp/v2/posts?_embed&per_page=${postsPerPage}&page=${page}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const wpPosts = await response.json();

      if (wpPosts.length === 0) {
        setHasMorePosts(false);
        return;
      }

      const formattedPosts = wpPosts.map((post: any, index: number) => {
        // 提取第一個標籤名稱
        let firstTagName = '未分類';
        const terms = post._embedded?.['wp:term']?.flat();
        if (terms) {
          const firstTag = terms.find((term: any) => term.taxonomy === 'post_tag');
          if (firstTag) {
            firstTagName = firstTag.name;
          }
        }

        return {
          id: `${post.id}-${page}-${index}`, // 確保唯一ID
          originalId: post.id,
          title: post.title.rendered,
          slug: post.slug,
          featuredImage:
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            '/images/default-post-image.svg',
          date: new Date(post.date).toLocaleDateString('zh-TW'),
          tag: firstTagName,
        };
      });

      // 將新文章與舊文章去重整合（以 originalId 判定）
      setPosts((prevPosts: Post[]) => {
        const existingIds = new Set(prevPosts.map((p: Post) => p.originalId));
        const uniqueNewPosts = formattedPosts.filter((p: Post) => !existingIds.has(p.originalId));
        return [...prevPosts, ...uniqueNewPosts];
      });
      setCurrentPage(page + 1);
      setHasMorePosts(page < totalPages);
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMorePosts, postsPerPage]);

  useEffect(() => {
    loadPosts(currentPage);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadPosts(currentPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, loadPosts]);

  return (
    <div id="wordpress-posts">
      <div className="max-w-[1080px] mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
          偷偷推薦給你
          <div className="w-20 h-1 bg-[#FFA4B3] mx-auto mt-4"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="posts-grid">
          {posts.map((post, index) => (
            <Link
              key={`${post.originalId}-${index}`}
              href={`/blog/${post.slug}`}
              className="block h-full post-card animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden h-full flex flex-col">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/default-post-image.svg';
                    }}
                  />
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-[#FFE5E9] text-[#FF8599] rounded-full text-sm">
                      {post.tag}
                    </span>
                    <span className="text-gray-400 text-sm">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800 hover:text-[#FFA4B3] transition line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {isLoading && (
          <div id="loading-spinner" className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FFA4B3] border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
} 