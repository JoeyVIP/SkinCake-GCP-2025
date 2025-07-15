import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

type Props = {
  searchParams: { q?: string };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  const query = searchParams.q || '';
  
  return {
    title: query ? `搜尋結果：${query} | SkinCake` : '搜尋 | SkinCake',
    description: query 
      ? `在 SkinCake 搜尋「${query}」的相關文章和內容。`
      : '在 SkinCake 搜尋韓國美容、旅遊、美食相關文章。',
  };
}

export default function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          搜尋結果
        </h1>
        
        {query && (
          <p className="text-gray-600 mb-8">
            搜尋關鍵字：<span className="font-medium text-pink-600">「{query}」</span>
          </p>
        )}

        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        }>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
} 