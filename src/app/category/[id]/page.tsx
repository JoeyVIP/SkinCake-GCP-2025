import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getCategoryById, getPostsByCategoryWithPagination } from '@/lib/wordpress-api';
import CategoryHeader from '@/components/CategoryHeader';
import ArticleListView from '@/components/ArticleListView';

// GCP 環境檢測
const isCloudRun = process.env.K_SERVICE !== undefined;

interface CategoryPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    sort?: 'date' | 'title' | 'comment_count';
    order?: 'asc' | 'desc';
  };
}

// 生成靜態參數 - GCP 環境優化
export async function generateStaticParams() {
  try {
    // GCP 環境：只預生成少量熱門分類，避免建置超時
    if (isCloudRun) {
      console.log('GCP 環境：限制預生成分類數量以避免建置超時');
      return []; // 在 GCP 環境中禁用預生成，改用 ISR
    }

    // 本地環境：正常預生成所有分類
    const categories = await getCategories();
    return categories.slice(0, 15).map((category) => ({
      id: category.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const categoryId = parseInt(params.id);
    const category = await getCategoryById(categoryId);

    if (!category) {
      return {
        title: '分類未找到 | SkinCake',
        description: '抱歉，找不到您要的分類。',
      };
    }

    return {
      title: `${category.name} | SkinCake`,
      description: `瀏覽 ${category.name} 分類下的所有文章，共有 ${category.count} 篇內容`,
      openGraph: {
        title: `${category.name} | SkinCake`,
        description: `瀏覽 ${category.name} 分類下的所有文章`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: 'SkinCake',
      description: '韓國美容與旅行分享',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  try {
    const categoryId = parseInt(params.id);
    const currentPage = parseInt(searchParams.page || '1');
    const sortBy = searchParams.sort || 'date';
    const order = searchParams.order || 'desc';

    if (isNaN(categoryId)) {
      notFound();
    }

    const [category, postsData] = await Promise.all([
      getCategoryById(categoryId),
      getPostsByCategoryWithPagination(categoryId, currentPage, 12, sortBy, order),
    ]);

    if (!category) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <CategoryHeader category={category} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {category.name} ({postsData.total} 篇文章)
            </h2>
            <p className="text-gray-600">
              目前顯示第 {currentPage} 頁，共 {postsData.totalPages} 頁
            </p>
          </div>
          
          <ArticleListView posts={postsData.posts} />
          
          {/* 分頁導航 */}
          {postsData.totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              {Array.from({ length: postsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`/category/${categoryId}?page=${pageNum}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pageNum === currentPage
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-300'
                  }`}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    notFound();
  }
}

// GCP 環境：啟用 ISR 而非靜態生成
export const dynamic = isCloudRun ? 'force-dynamic' : 'auto';
export const revalidate = isCloudRun ? 3600 : false; // GCP 環境使用 1 小時 ISR 