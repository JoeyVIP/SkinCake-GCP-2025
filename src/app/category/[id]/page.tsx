import { Metadata } from 'next';
import { 
  getCategories, 
  getPostsByCategoryWithPagination, 
  getTags
} from '@/lib/wordpress-api';
import CategoryPageClient from './CategoryPageClient';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    id: category.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find(cat => cat.id.toString() === params.id);
  
  if (!category) {
    return {
      title: '分類未找到 | SkinCake',
    };
  }

  return {
    title: `${category.name} | SkinCake`,
    description: `探索 ${category.name} 相關的韓國美容旅遊文章，共有 ${category.count} 篇精彩內容。`,
    openGraph: {
      title: `${category.name} | SkinCake`,
      description: `探索 ${category.name} 相關的韓國美容旅遊文章，共有 ${category.count} 篇精彩內容。`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const categories = await getCategories();
  const category = categories.find(cat => cat.id.toString() === params.id);
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">分類未找到</h1>
        <p className="text-center mt-4">
          <a href="/" className="text-pink-500 hover:text-pink-600">
            返回首頁
          </a>
        </p>
      </div>
    );
  }

  // 獲取初始數據
  const { posts, totalPages, total } = await getPostsByCategoryWithPagination(
    category.id, 
    1, 
    12, 
    'date', 
    'desc'
  );
  const tags = await getTags();

  return (
    <CategoryPageClient
      initialCategory={category}
      initialPosts={posts}
      initialTotalPages={totalPages}
      initialTotal={total}
      allCategories={categories}
      tags={tags}
    />
  );
} 