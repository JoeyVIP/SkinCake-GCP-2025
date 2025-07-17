'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedImageFromPost, createImageProps, getImagePlaceholder } from '@/lib/image-utils';

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

        // 使用新的圖片工具獲取圖片
        const imageSource = getFeaturedImageFromPost(post);

        return {
          id: `${post.id}-${page}-${index}`, // 確保唯一ID
          originalId: post.id,
          title: post.title.rendered,
          slug: post.slug,
          featuredImage: imageSource.url,
          date: new Date(post.date).toLocaleDateString('zh-TW'),
          tag: firstTagName,
        };
      });

      if (page === 1) {
        setPosts(formattedPosts);
      } else {
        setPosts(prev => [...prev, ...formattedPosts]);
      }

      setHasMorePosts(page < totalPages);
    } catch (error) {
      console.error('Error loading posts:', error);
      setHasMorePosts(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMorePosts, postsPerPage]);

  useEffect(() => {
    loadPosts(1);
  }, []);

  const loadMorePosts = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPosts(nextPage);
  };

  return (
    <div id="wordpress-posts">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="posts-grid">
          {posts.map((post, index) => {
            const imageProps = createImageProps({
              url: post.featuredImage,
              alt: post.title
            });

            return (
              <Link
                key={`${post.originalId}-${index}`}
                href={`/blog/${post.slug}`}
                className="block h-full post-card animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden h-full flex flex-col">
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <Image
                      {...imageProps}
                      fill
                      className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition duration-300"
                      placeholder="blur"
                      blurDataURL={getImagePlaceholder(400, 225)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            );
          })}
        </div>

        {/* 載入更多按鈕 */}
        {hasMorePosts && (
          <div className="text-center mt-12">
            <button
              onClick={loadMorePosts}
              disabled={isLoading}
              className="bg-[#FFA4B3] hover:bg-[#FF8599] disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
            >
              {isLoading ? '載入中...' : '載入更多'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 