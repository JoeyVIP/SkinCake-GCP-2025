'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { WPTag } from '@/lib/wordpress-api';

interface Tag {
  id: string;
  name: string;
}

interface Post {
  id: string;
  originalId: number;
  title: string;
  slug: string;
  featuredImage: string;
  date: string;
}

interface TagCloudProps {
  tags?: WPTag[];
}

export default function TagCloud({ tags: wpTags }: TagCloudProps = {}) {
  const [selectedTag, setSelectedTag] = useState<string>('myeongdong');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 定義標籤
  const tags: Tag[] = [
    { id: 'myeongdong', name: '明洞' },
    { id: 'hongdae', name: '弘大' },
    { id: 'gangnam', name: '江南' },
    { id: 'seongsu', name: '聖水洞' },
    { id: 'hannam', name: '漢南洞' },
    { id: 'mangwon', name: '望遠洞' },
    { id: 'yeonnam', name: '延南洞' },
    { id: 'seoulforest', name: '首爾林' },
    { id: 'dongdaemun', name: '東大門' }
  ];

  useEffect(() => {
    handleTagClick(selectedTag);
  }, []);

  const handleTagClick = async (tagId: string) => {
    setSelectedTag(tagId);
    setIsLoading(true);

    const tagName = tags.find(tag => tag.id === tagId)?.name || '';

    try {
      // 首先獲取WordPress標籤
      const tagsResponse = await fetch('https://skincake.online/wp-json/wp/v2/tags?per_page=100', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const wpTags = await tagsResponse.json();
      const matchingTag = wpTags.find((tag: any) => tag.name === tagName);

      let wpPosts = [];

      if (matchingTag) {
        // 使用標籤ID獲取文章
        const response = await fetch(`https://skincake.online/wp-json/wp/v2/posts?tags=${matchingTag.id}&_embed`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        wpPosts = await response.json();
      } else {
        // 如果沒有找到匹配的標籤，使用搜索API
        const response = await fetch(`https://skincake.online/wp-json/wp/v2/posts?search=${encodeURIComponent(tagName)}&_embed`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        wpPosts = await response.json();
      }

      const formattedPosts = wpPosts.map((post: any, index: number) => ({
        id: `tag-${tagId}-${post.id}-${index}`, // 確保唯一ID
        originalId: post.id,
        title: post.title.rendered,
        slug: post.slug,
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
          '/images/default-post-image.svg',
        date: new Date(post.date).toLocaleDateString('zh-TW')
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 標籤雲區塊 */}
      <div id="tag-cloud" className="max-w-[1080px] mx-auto px-4 pt-12 pb-0">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
            從地區開始探索
            <div className="w-20 h-1 bg-[#FFA4B3] mx-auto mt-4"></div>
          </h2>
          <p className="text-gray-600 text-center mb-8">不知道去哪就從這裡開始！</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto px-4">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.id)}
                className={`tag-button inline-block px-4 py-2 m-1 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                  selectedTag === tag.id
                    ? 'bg-[#FFA4B3] text-white'
                    : 'bg-[#FFE5E9] text-[#FF8599] hover:bg-white hover:text-gray-700'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 標籤文章容器 */}
      <div id="tag-posts" className="max-w-[1080px] mx-auto px-4 pt-6 pb-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFA4B3]"></div>
            <p className="mt-4 text-gray-500">正在載入文章...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block h-full">
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
                        {tags.find(t => t.id === selectedTag)?.name}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">暫時沒有文章😊</p>
          </div>
        )}
      </div>
    </>
  );
} 