import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { 
  getCategoryBySlug, 
  getCategoriesExcludeUncategorized,
  getPostsByCategoryWithPagination 
} from '@/lib/wordpress-api';
import CategoryKeywords from '@/components/category/CategoryKeywords';
import CategoryArticleGrid from '@/components/category/CategoryArticleGrid';
import CategoryPagination from '@/components/category/CategoryPagination';
import CategoryLoadingSkeleton from '@/components/category/CategoryLoadingSkeleton';
import CategoryClientContainer from '@/components/category/CategoryClientContainer';

// GCP 環境檢測
const isCloudRun = process.env.K_SERVICE !== undefined;

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// 生成靜態參數（預渲染所有分類頁）
export async function generateStaticParams() {
  try {
    // GCP 環境：只預生成少量熱門分類，避免建置超時
    if (isCloudRun) {
      console.log('GCP 環境：限制預生成分類數量以避免建置超時');
      return []; // 在 GCP 環境中禁用預生成，改用 ISR
    }

    // 本地環境：正常預生成所有分類
    const categories = await getCategoriesExcludeUncategorized();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

// SEO 元數據生成
export async function generateMetadata({ 
  params
}: { params: { slug: string } }): Promise<Metadata> {
  try {
    const category = await getCategoryBySlug(params.slug);
    
    if (!category) {
      return {
        title: '找不到分類 - SkinCake',
        description: '抱歉，找不到您要的分類。',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // 只為第一頁生成元數據，避免 Dynamic Server Usage 錯誤
    const pageTitle = `${category.name} - SkinCake 肌膚蛋糕`;

    return {
      title: pageTitle,
      description: `探索 ${category.name} 相關文章，發現韓國旅遊的美好體驗。共有 ${category.count} 篇精彩內容等您來看。`,
      keywords: `${category.name}, 韓國旅遊, 韓國美容, 韓國購物, 韓國美食, SkinCake`,
      robots: {
        index: false, // 開發環境不索引
        follow: false,
      },
      alternates: {
        canonical: `https://skincake.tw/category/${encodeURIComponent(category.slug)}`,
      },
      formatDetection: {
        telephone: false,
        address: false,
        email: false,
      },
      openGraph: {
        title: `${category.name} - SkinCake`,
        description: `${category.name} 分類下共有 ${category.count} 篇精彩文章`,
        siteName: 'SkinCake 肌膚蛋糕',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} - SkinCake`,
        description: `探索 ${category.name} 相關文章`,
      },
      icons: {
        shortcut: '/images/favicon-32x32.png',
        icon: [
          { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
          { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
          { url: '/images/favicon-120x120.png', sizes: '120x120', type: 'image/png' },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: 'SkinCake 肌膚蛋糕',
      description: '韓國美容與旅行分享',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    console.log('CategoryPage: Starting with params:', params);
    
    // 修改：移除 searchParams 依賴，改為靜態載入第一頁
    const currentPage = 1; // 固定載入第一頁
    const postsPerPage = 9; // 每頁9篇文章，匹配線上版

    console.log('CategoryPage: Parsed currentPage:', currentPage);

    // 獲取當前分類
    console.log('CategoryPage: Fetching category for slug:', params.slug);
    const currentCategory = await getCategoryBySlug(params.slug);
    
    if (!currentCategory) {
      console.log('CategoryPage: Category not found for slug:', params.slug);
      notFound();
    }

    console.log('CategoryPage: Found category:', currentCategory);

    // 並行獲取數據
    console.log('CategoryPage: Fetching categories and posts...');
    const [allCategories, postsData] = await Promise.all([
      getCategoriesExcludeUncategorized(),
      getPostsByCategoryWithPagination(currentCategory.id, currentPage, postsPerPage)
    ]);

    console.log('CategoryPage: Data fetched successfully');
    console.log('- Categories count:', allCategories.length);
    console.log('- Posts count:', postsData.posts.length);
    console.log('- Total pages:', postsData.totalPages);

    return (
      <div className="bg-[#FFF9FA] min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-[1080px]">
          {/* 熱門旅遊關鍵字 */}
          <Suspense fallback={<CategoryLoadingSkeleton />}>
            <CategoryKeywords 
              categories={allCategories}
              currentCategorySlug={params.slug}
            />
          </Suspense>
          
          {/* 客戶端容器管理動態內容 */}
          <CategoryClientContainer
            initialPosts={postsData.posts}
            currentCategory={currentCategory}
            totalPages={postsData.totalPages}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    notFound();
  }
}

// GCP 環境：使用 ISR 快取策略
export const revalidate = 3600; // 1 小時重新驗證 