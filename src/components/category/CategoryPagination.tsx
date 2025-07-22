'use client';

import { useState } from 'react';
import { getPostsByCategoryWithPagination } from '@/lib/wordpress-api';
import { WPPost } from '@/lib/wordpress-api';

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  categorySlug: string;
  categoryId: number;
  onPageChange?: (posts: WPPost[], page: number) => void;
}

export default function CategoryPagination({ 
  currentPage: initialPage, 
  totalPages, 
  categorySlug,
  categoryId,
  onPageChange
}: CategoryPaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  
  // 如果只有一頁或少於一頁，不顯示分頁
  if (totalPages <= 1) {
    return null;
  }

  // 處理頁面切換
  const handlePageChange = async (page: number) => {
    if (page === currentPage || isLoading) return;
    
    setIsLoading(true);
    try {
      const postsData = await getPostsByCategoryWithPagination(categoryId, page, 9);
      setCurrentPage(page);
      onPageChange?.(postsData.posts, page);
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 計算要顯示的頁碼
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // 最多顯示5個頁碼
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // 調整開始位置確保顯示足夠的頁碼
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-12 space-x-2">
      {isLoading && (
        <div className="text-sm text-gray-500 mr-4">載入中...</div>
      )}
      
      {/* 上一頁 */}
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isLoading}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          上一頁
        </button>
      )}
      
      {/* 頁碼 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          disabled={isLoading}
          className={`px-3 py-2 text-sm rounded-md transition-colors disabled:opacity-50 ${
            page === currentPage
              ? 'bg-pink-500 text-white border border-pink-500'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* 下一頁 */}
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLoading}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          下一頁
        </button>
      )}
    </div>
  );
} 