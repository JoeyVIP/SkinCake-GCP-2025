'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WPPost } from "@/lib/wordpress-api";
import { getFeaturedImageFromPost, createImageProps, getImagePlaceholder } from "@/lib/image-utils";

// 暫時使用 any 作為 post 的類型，稍後會用 WPPost 替換
export default function ArticleCard({ post }: { post: any }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imageSource = getFeaturedImageFromPost(post);
  const imageProps = createImageProps(imageSource);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (imageProps.onLoad) imageProps.onLoad();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    if (imageProps.onError) imageProps.onError(e);
  };

  return (
    <div className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video">
          {/* 載入狀態覆蓋層 */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">載入中...</div>
            </div>
          )}
          
          <Image
            src={imageProps.src}
            alt={imageProps.alt}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL={getImagePlaceholder(800, 450)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
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