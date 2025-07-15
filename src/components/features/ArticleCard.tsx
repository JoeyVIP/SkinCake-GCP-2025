'use client';

import Image from "next/image";
import Link from "next/link";
import { WPPost } from "@/lib/wordpress-api";

// 暫時使用 any 作為 post 的類型，稍後會用 WPPost 替換
export default function ArticleCard({ post }: { post: any }) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url || '/images/default-post-image.svg';

  return (
    <div className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={post.title.rendered || '文章圖片'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/images/default-post-image.svg') {
                console.log('Article image failed to load, using default:', imageUrl);
                target.src = '/images/default-post-image.svg';
              }
            }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold leading-tight text-gray-800 group-hover:text-pink-600">
            {post.title.rendered}
          </h3>
          <div 
            className="mt-2 text-sm text-gray-600 line-clamp-2" 
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
          />
        </div>
      </Link>
    </div>
  );
} 