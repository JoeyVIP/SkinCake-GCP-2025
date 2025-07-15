'use client';

import React, { useState, useEffect } from 'react';
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
  category: string;
}

export default function CakeNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 預設文章數據
  const defaultPosts: Post[] = [
    {
      id: 'default-1',
      originalId: 1,
      title: '首爾自由行全攻略',
      slug: 'seoul-travel-guide',
      featuredImage: '/images/default-post-image.svg',
      date: '2024.03.20',
      category: '旅遊'
    },
    {
      id: 'default-2',
      originalId: 2,
      title: '釜山三天兩夜這樣玩',
      slug: 'busan-3days-travel',
      featuredImage: '/images/default-post-image.svg',
      date: '2024.03.18',
      category: '旅遊'
    },
    {
      id: 'default-3',
      originalId: 3,
      title: '首爾必吃美食清單',
      slug: 'seoul-must-eat-food',
      featuredImage: '/images/default-post-image.svg',
      date: '2024.03.15',
      category: '美食'
    }
  ];

  useEffect(() => {
    fetchCakeNews();
  }, []);

  const fetchCakeNews = async () => {
    try {
      // 嘗試從WordPress API獲取文章
      const response = await fetch('https://skincake.online/wp-json/wp/v2/posts?_embed&per_page=3', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const wpPosts: any[] = await response.json();
      
      const formattedPosts = wpPosts.map((post: any, index: number) => {
        // 使用新的圖片工具獲取圖片
        const imageSource = getFeaturedImageFromPost(post);

        return {
          id: `cakenews-${post.id}-${index}`, // 確保唯一ID
          originalId: post.id,
          title: post.title.rendered,
          slug: post.slug,
          featuredImage: imageSource.url,
          date: new Date(post.date).toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          }).replace(/\//g, '.'),
          category: post._embedded?.['wp:term']?.[0]?.[0]?.name || '未分類'
        };
      });

      setPosts(formattedPosts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching posts:', error);
      // 使用預設文章
      setPosts(defaultPosts);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 py-12 bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFA4B3]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto px-4 py-12 bg-white">
      <h2 className="text-2xl font-bold mb-2">蛋糕報報</h2>
      <p className="text-gray-600 mb-6">小蛋糕每週推薦，不踩雷的旅韓清單！</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const imageProps = createImageProps({
            url: post.featuredImage,
            alt: post.title
          });

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48">
                  <Image
                    {...imageProps}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL={getImagePlaceholder(400, 192)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-[#FFE5E9] text-[#FF8599] rounded text-xs">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-[#FFA4B3] transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 