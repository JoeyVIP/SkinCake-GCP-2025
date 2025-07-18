import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getRandomPosts, getRecentPosts, getFeaturedImageUrl, getCategoryNames, WPPost } from '@/lib/wordpress-api';
import ShareButtons from '@/components/ShareButtons';
import BackToTop from '@/components/BackToTop';
import RandomRelatedPosts from './RandomRelatedPosts';
import ArticleJsonLd from '@/components/ArticleJsonLd';
import Image from 'next/image';
import { getFeaturedImageFromPost, createImageProps } from '@/lib/image-utils';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: { slug: string };
};

// 生成靜態參數以預渲染熱門文章
export async function generateStaticParams() {
  try {
    // 獲取最新的 50 篇文章進行預渲染，增加快取覆蓋率
    const posts = await getRecentPosts(50);
    
    return posts.map((post: WPPost) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 設置 ISR 重新驗證時間
export const revalidate = 3600; // 1 小時

// 生成 metadata 以確保 Facebook 和其他社交平台能正確抓取資訊
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: '找不到文章 - SKIN CAKE 肌膚蛋糕',
      };
    }

    const featuredImage = getFeaturedImageUrl(post);
    const categories = getCategoryNames(post);
    const baseUrl = process.env.FRONTEND_DOMAIN || 'https://localhost:3000';
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    
    // 從文章內容中提取純文字作為描述
    const contentText = post.content?.rendered
      ?.replace(/<[^>]*>/g, '') // 移除 HTML 標籤
      ?.substring(0, 160) // 限制長度
      ?.trim() || '閱讀更多關於韓國旅遊、美食和生活的精彩內容';

    return {
      title: `${post.title.rendered} - SKIN CAKE 肌膚蛋糕`,
      description: contentText,
      keywords: categories.join(', '),
      
      // 標準化 URL
      alternates: {
        canonical: postUrl,
      },
      
      // Open Graph for Facebook
      openGraph: {
        title: post.title.rendered,
        description: contentText,
        url: postUrl,
        siteName: 'SKIN CAKE 肌膚蛋糕',
        locale: 'zh_TW',
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified || post.date,
        authors: ['SKIN CAKE'],
        section: categories[0] || '未分類',
        tags: categories,
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: post.title.rendered,
          }
        ],
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: post.title.rendered,
        description: contentText,
        images: [featuredImage],
        site: '@skincake_tw',
        creator: '@skincake_tw',
      },
      
      // 其他 meta tags
      other: {
        'fb:app_id': '1879313576190232',
        'article:published_time': post.date,
        'article:modified_time': post.modified || post.date,
        'article:author': 'SKIN CAKE',
        'article:section': categories[0] || '未分類',
      },
      
      // 機器人設定
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '載入錯誤 - SKIN CAKE 肌膚蛋糕',
    };
  }
}

export default async function BlogPost({ params }: Props) {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      notFound();
    }

    const relatedPosts = await getRandomPosts(6, post.id);
    const featuredImage = getFeaturedImageUrl(post);
    const categories = getCategoryNames(post);
    
    // 使用 image-utils 取得優化的圖片資訊
    const imageSource = getFeaturedImageFromPost(post);
    const imageProps = createImageProps(imageSource);
    
    // 建立麵包屑項目
    const breadcrumbItems = [
      { name: '首頁', href: '/' },
      ...(categories.length > 0 
        ? [{ name: categories[0], href: `/category/${encodeURIComponent(categories[0])}` }]
        : []
      ),
      { name: post.title.rendered }
    ];

    return (
      <>
        {/* 結構化數據 */}
        <ArticleJsonLd post={post} />
        
        <div className="min-h-screen bg-[#FFF9FA]">
          {/* 主要內容區域 - 完全按照線上版本 */}
          <div className="mx-auto py-8" style={{ width: '100%', maxWidth: '1200px' }}>
          
          {/* 文章容器 - 與線上版本完全一致 */}
          <div className="max-w-[800px] mx-auto">
            
            {/* 麵包屑導航 */}
            <Breadcrumb items={breadcrumbItems} className="mb-6 px-4" />
            
            {/* 特色圖片 - 按照線上版本的精確實現 */}
            {featuredImage && (
              <div className="mb-8 relative w-full h-[400px]">
                <Image 
                  src={imageProps.src}
                  alt={imageProps.alt}
                  fill
                  className="object-cover rounded-xl shadow-md"
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                  quality={85}
                />
              </div>
            )}

            {/* 文章內容卡片 - 白色背景，圓角，陰影 */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-8">
              
              {/* 標籤和分享按鈕行 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#FFE5E9] text-[#FF8599] rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                  <span className="text-gray-500 text-xs">
                    {new Date(post.date).toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* 文章標題 */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                {post.title.rendered}
              </h1>

              {/* 文章內容 */}
              <div className="article-content prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
              </div>
            </div>
          </div>

          {/* 分享按鈕區塊 */}
          <div className="max-w-[800px] mx-auto mb-8">
            <ShareButtons 
              title={post.title.rendered}
              url={`${process.env.FRONTEND_DOMAIN || 'https://localhost:3000'}/blog/${post.slug}`}
            />
          </div>

          {/* 相關文章推薦 - 客戶端組件處理隨機化 */}
          {relatedPosts.length > 0 && (
            <RandomRelatedPosts initialPosts={relatedPosts} excludeId={post.id} />
          )}
        </div>

        {/* 固定分享按鈕暫時移除，專注於主要功能 */}
        
          <BackToTop />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
} 