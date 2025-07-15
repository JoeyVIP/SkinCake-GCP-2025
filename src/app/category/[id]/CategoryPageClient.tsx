'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getPostsByCategoryWithPagination, 
  getRelatedCategories,
  WPPost,
  WPCategory,
  WPTag
} from '@/lib/wordpress-api';
import CategoryHeader from '@/components/CategoryHeader';
import ArticleGrid from '@/components/ArticleGrid';
import ArticleListView from '@/components/ArticleListView';
import CategoryFilter from '@/components/CategoryFilter';
import TagCloud from '@/components/TagCloud';
import RelatedCategories from '@/components/RelatedCategories';

interface CategoryPageClientProps {
  initialCategory: WPCategory;
  initialPosts: WPPost[];
  initialTotalPages: number;
  initialTotal: number;
  allCategories: WPCategory[];
  tags: WPTag[];
}

export default function CategoryPageClient({
  initialCategory,
  initialPosts,
  initialTotalPages,
  initialTotal,
  allCategories,
  tags
}: CategoryPageClientProps) {
  const searchParams = useSearchParams();
  
  // 狀態管理
  const [posts, setPosts] = useState<WPPost[]>(initialPosts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [relatedCategories, setRelatedCategories] = useState<WPCategory[]>([]);
  
  // 篩選參數
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // 載入相關分類
  useEffect(() => {
    const loadRelatedCategories = async () => {
      const related = await getRelatedCategories(initialCategory.id);
      setRelatedCategories(related.slice(0, 5)); // 限制顯示5個相關分類
    };
    
    loadRelatedCategories();
  }, [initialCategory.id]);

  // 處理篩選變更
  const handleFilterChange = async (
    newPage: number = currentPage,
    newSortBy: string = sortBy,
    newSortOrder: string = sortOrder
  ) => {
    setLoading(true);
    
    try {
      const result = await getPostsByCategoryWithPagination(
        initialCategory.id,
        newPage,
        12,
        newSortBy as 'date' | 'title' | 'comment_count',
        newSortOrder as 'asc' | 'desc'
      );
      
      setPosts(result.posts);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      setCurrentPage(newPage);
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleFilterChange(page, sortBy, sortOrder);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    handleFilterChange(1, newSortBy, newSortOrder); // 排序變更時重置到第一頁
  };

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 分類標題 */}
      <CategoryHeader category={initialCategory} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* 主要內容區域 */}
        <div className="lg:col-span-3">
          {/* 篩選器 */}
          <CategoryFilter
            totalPosts={total}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            onViewChange={handleViewChange}
            currentView={view}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />

          {/* 載入狀態 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <span className="ml-2 text-gray-600">載入中...</span>
            </div>
          )}

          {/* 文章內容 */}
          {!loading && (
            <>
              {view === 'grid' ? (
                <ArticleGrid posts={posts} />
              ) : (
                <ArticleListView posts={posts} />
              )}
            </>
          )}
        </div>

        {/* 側邊欄 */}
        <div className="lg:col-span-1">
          {/* 相關分類 */}
          {relatedCategories.length > 0 && (
            <div className="mb-6">
              <RelatedCategories 
                categories={relatedCategories}
                currentCategoryId={initialCategory.id}
              />
            </div>
          )}

          {/* 標籤雲 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">熱門標籤</h3>
            <TagCloud tags={tags.slice(0, 20)} />
          </div>

          {/* 分類導航 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">所有分類</h3>
            <div className="space-y-2">
              {allCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    cat.id === initialCategory.id
                      ? 'bg-pink-100 text-pink-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.name} ({cat.count})
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 