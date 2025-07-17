'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedImageFromPost, createImageProps, getImagePlaceholder } from '@/lib/image-utils';

interface Post {
  id: string;
  originalId: number;
  title: string;
  slug: string;
  featuredImage: string;
  excerpt: string;
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
      excerpt: '詳細的首爾自由行攻略，包含交通、住宿、美食推薦，讓你輕鬆玩遍首爾各大景點...',
      date: '2024.03.20',
      category: '蛋糕報報'
    },
    {
      id: 'default-2',
      originalId: 2,
      title: '釜山三天兩夜這樣玩',
      slug: 'busan-3days-travel',
      featuredImage: '/images/default-post-image.svg',
      excerpt: '釜山完美三日遊行程規劃，從海雲台到甘川洞文化村，體驗不一樣的韓國風情...',
      date: '2024.03.18',
      category: '蛋糕報報'
    },
    {
      id: 'default-3',
      originalId: 3,
      title: '首爾必吃美食清單',
      slug: 'seoul-must-eat-food',
      featuredImage: '/images/default-post-image.svg',
      excerpt: '首爾必吃美食全攻略！從街頭小吃到高級餐廳，精選最道地的韓式料理推薦...',
      date: '2024.03.15',
      category: '蛋糕報報'
    }
  ];

  useEffect(() => {
    fetchCakeNews();
  }, []);

  const fetchCakeNews = async () => {
    try {
      // 先獲取「蛋糕報報」分類的ID
      const categoriesResponse = await fetch('https://skincake.online/wp-json/wp/v2/categories?search=蛋糕報報', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      let categoryId = null;
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        if (categories && categories.length > 0) {
          categoryId = categories[0].id;
        }
      }

      // 獲取蛋糕報報分類的文章，如果沒有找到分類就獲取最新文章
      const postsUrl = categoryId 
        ? `https://skincake.online/wp-json/wp/v2/posts?categories=${categoryId}&_embed&per_page=3`
        : 'https://skincake.online/wp-json/wp/v2/posts?_embed&per_page=3';
        
      const response = await fetch(postsUrl, {
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
          excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || '',
          date: new Date(post.date).toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          }).replace(/\//g, '.'),
          category: post._embedded?.['wp:term']?.[0]?.[0]?.name || '蛋糕報報'
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
      <div className="max-w-[1080px] mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">蛋糕報報</h2>
          <p className="text-gray-600 text-lg">小蛋糕每週推薦，不踩雷的旅韓清單！</p>
        </div>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFA4B3]"></div>
          <p className="mt-4 text-gray-500">正在載入文章...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">蛋糕報報</h2>
        <p className="text-gray-600 text-lg">小蛋糕每週推薦，不踩雷的旅韓清單！</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          const imageProps = createImageProps({
            url: post.featuredImage,
            alt: post.title
          });

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block h-full group"
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
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-sm">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 hover:text-[#FFA4B3] transition line-clamp-2">
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