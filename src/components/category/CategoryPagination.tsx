'use client';

import Link from 'next/link';

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  categorySlug: string;
}

export default function CategoryPagination({ 
  currentPage, 
  totalPages, 
  categorySlug 
}: CategoryPaginationProps) {
  // 如果只有一頁或少於一頁，不顯示分頁
  if (totalPages <= 1) {
    return null;
  }

  // 生成頁面 URL 的簡單函數
  const createPageUrl = (page: number) => {
    if (page === 1) {
      return `/category/${categorySlug}`;
    }
    return `/category/${categorySlug}?page=${page}`;
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
      {/* 上一頁 */}
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          上一頁
        </Link>
      )}
      
      {/* 頁碼 */}
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            page === currentPage
              ? 'bg-pink-500 text-white border border-pink-500'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}
      
      {/* 下一頁 */}
      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          下一頁
        </Link>
      )}
    </div>
  );
} 