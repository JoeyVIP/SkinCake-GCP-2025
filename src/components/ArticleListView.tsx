import Image from 'next/image';
import Link from 'next/link';
import { WPPost, getFeaturedImageUrl, getCategoryNames } from '@/lib/wordpress-api';

interface ArticleListViewProps {
  posts: WPPost[];
}

export default function ArticleListView({ posts }: ArticleListViewProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">目前還沒有文章</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const featuredImage = getFeaturedImageUrl(post);
        const categories = getCategoryNames(post);
        
        return (
          <article 
            key={post.id} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* 圖片區域 */}
              <div className="md:w-80 h-48 md:h-auto relative flex-shrink-0">
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={featuredImage}
                    alt={post.title.rendered}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </Link>
              </div>

              {/* 內容區域 */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  {/* 分類標籤 */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {categories.slice(0, 2).map((category, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-medium rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 標題 */}
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:text-pink-600 transition-colors"
                    >
                      {post.title.rendered}
                    </Link>
                  </h2>

                  {/* 摘要 */}
                  <div 
                    className="text-gray-600 mb-4 line-clamp-3 flex-grow"
                    dangerouslySetInnerHTML={{ 
                      __html: stripHtml(post.excerpt.rendered) 
                    }}
                  />

                  {/* 底部資訊 */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                    >
                      閱讀更多 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
} 