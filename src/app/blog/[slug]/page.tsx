import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getAllPosts, getRecentPosts, getFeaturedImageUrl, getCategoryNames, getTagNames } from '@/lib/wordpress-api';
import ShareButtons from '@/components/ShareButtons';
import BackToTop from '@/components/BackToTop';

// GCP 環境檢測
const isCloudRun = process.env.K_SERVICE !== undefined;

type Props = {
  params: { slug: string };
};

// 生成靜態參數 - GCP 環境優化
export async function generateStaticParams() {
  try {
    // GCP 環境：只預生成少量熱門文章，避免建置超時
    if (isCloudRun) {
      console.log('GCP 環境：限制預生成文章數量以避免建置超時');
      return []; // 在 GCP 環境中禁用預生成，改用 ISR
    }
    
    // 本地環境：正常預生成所有文章
    const posts = await getAllPosts();
    return posts.slice(0, 10).map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: '文章未找到 | SkinCake',
        description: '抱歉，找不到您要的文章。',
      };
    }

    const featuredImage = getFeaturedImageUrl(post);
    
    // 清理 HTML 標籤以獲得純文字描述
    const cleanDescription = post.excerpt?.rendered
      ?.replace(/<[^>]*>/g, '')
      ?.trim()
      ?.substring(0, 160) || '';

    return {
      title: `${post.title.rendered} | SkinCake`,
      description: cleanDescription,
      openGraph: {
        title: post.title.rendered,
        description: cleanDescription,
        images: [{ url: featuredImage }],
        type: 'article',
        publishedTime: post.date,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.rendered,
        description: cleanDescription,
        images: [featuredImage],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'SkinCake',
      description: '韓國美容與旅行分享',
    };
  }
}

export default async function BlogPost({ params }: Props) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    const relatedPosts = await getRecentPosts(6);
    const featuredImage = getFeaturedImageUrl(post);
    const categories = getCategoryNames(post);
    const tags = getTagNames(post);

    return (
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 文章標題和元數據 */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {post.title.rendered}
          </h1>
          
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          {/* 特色圖片 */}
          {featuredImage && (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
              <Image
                src={featuredImage}
                alt={post.title.rendered}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* 文章內容 */}
        <div
          className="prose prose-lg max-w-none prose-pink prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-pink-600 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* 標籤 */}
        {tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">標籤</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 分享按鈕 */}
        <ShareButtons 
          title={post.title.rendered}
          url={`${process.env.FRONTEND_DOMAIN}/blog/${post.slug}`}
        />

        {/* 相關文章 */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">相關文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 6).filter(relatedPost => relatedPost.id !== post.id).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={getFeaturedImageUrl(relatedPost)}
                        alt={relatedPost.title.rendered}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {relatedPost.title.rendered}
                      </h3>
                      <div 
                        className="mt-2 text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: relatedPost.excerpt.rendered }}
                      />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        <BackToTop />
      </article>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}

// GCP 環境：啟用 ISR 而非靜態生成
export const dynamic = isCloudRun ? 'force-dynamic' : 'auto';
export const revalidate = isCloudRun ? 3600 : false; // GCP 環境使用 1 小時 ISR 