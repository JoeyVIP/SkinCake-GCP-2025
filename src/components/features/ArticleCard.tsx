import Image from "next/image";
import Link from "next/link";
import { WPPost } from "@/lib/wordpress-api"; // 我們稍後會創建這個

// 暫時使用 any 作為 post 的類型，稍後會用 WPPost 替換
export default function ArticleCard({ post }: { post: any }) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <div className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video">
          {featuredMedia ? (
            <Image
              src={featuredMedia.source_url}
              alt={post.title.rendered}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
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