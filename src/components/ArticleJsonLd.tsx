import { WPPost, getFeaturedImageUrl, getCategoryNames } from '@/lib/wordpress-api';

interface ArticleJsonLdProps {
  post: WPPost;
}

export default function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const featuredImage = getFeaturedImageUrl(post);
  const categories = getCategoryNames(post);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skincake.tw';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title.rendered,
    image: {
      '@type': 'ImageObject',
      url: featuredImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Organization',
      name: 'SKIN CAKE 肌膚蛋糕',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/main_skincake_logo.png`,
        width: 200,
        height: 60,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'SKIN CAKE 肌膚蛋糕',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/main_skincake_logo.png`,
        width: 200,
        height: 60,
      },
    },
    description: post.excerpt.rendered
      .replace(/<[^>]*>/g, '')
      .substring(0, 160)
      .trim(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    articleSection: categories[0] || '未分類',
    keywords: categories.join(', '),
    // 添加文章內容的字數統計
    wordCount: post.content.rendered.replace(/<[^>]*>/g, '').length,
    // 添加評論數量（如果有的話）
    commentCount: 0,
    // 添加文章的語言
    inLanguage: 'zh-TW',
    // 添加是否為付費內容
    isAccessibleForFree: true,
    // 添加文章的潛在行動
    potentialAction: {
      '@type': 'ReadAction',
      target: `${baseUrl}/blog/${post.slug}`,
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 