'use client';

import Image from "next/image";
import Link from "next/link";
import { WPPost } from "@/lib/wordpress-api";
import { getFeaturedImageFromPost, createImageProps, getImagePlaceholder } from "@/lib/image-utils";

// 暫時使用 any 作為 post 的類型，稍後會用 WPPost 替換
export default function ArticleCard({ post }: { post: any }) {
  const imageSource = getFeaturedImageFromPost(post);
  const imageProps = createImageProps(imageSource);

  return (
    <div className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video">
          <Image
            {...imageProps}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={getImagePlaceholder(800, 450)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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