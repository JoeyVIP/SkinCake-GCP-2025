'use client';

import { useState } from 'react';

interface CategoryFilterProps {
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string, order: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
  sortBy: string;
  sortOrder: string;
}

export default function CategoryFilter({
  totalPosts,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  onViewChange,
  currentView,
  sortBy,
  sortOrder
}: CategoryFilterProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: 'date_desc', label: '最新發布', sortBy: 'date', order: 'desc' },
    { value: 'date_asc', label: '最早發布', sortBy: 'date', order: 'asc' },
    { value: 'title_asc', label: '標題 A-Z', sortBy: 'title', order: 'asc' },
    { value: 'title_desc', label: '標題 Z-A', sortBy: 'title', order: 'desc' },
    { value: 'comment_desc', label: '最多評論', sortBy: 'comment_count', order: 'desc' },
  ];

  const currentSort = sortOptions.find(
    option => option.sortBy === sortBy && option.order === sortOrder
  ) || sortOptions[0];

  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5;
    const half = Math.floor(showPages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* 結果資訊和視圖切換 */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          共 {totalPosts} 篇文章
        </span>
        
        {/* 視圖切換 */}
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            className={`p-2 px-3 text-sm ${
              currentView === 'grid'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            title="網格視圖"
          >
            ⊞
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 px-3 text-sm ${
              currentView === 'list'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            title="列表視圖"
          >
            ☰
          </button>
        </div>
      </div>

      {/* 排序和分頁 */}
      <div className="flex items-center gap-4">
        {/* 排序下拉選單 */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
          >
            <span className="text-sm">{currentSort.label}</span>
            <span className="text-xs">▼</span>
          </button>

          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.sortBy, option.order);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    option.value === `${sortBy}_${sortOrder}`
                      ? 'bg-pink-50 text-pink-600'
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 分頁 */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* 上一頁 */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一頁
            </button>

            {/* 頁碼 */}
            <div className="flex gap-1">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => onPageChange(1)}
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2 py-2 text-sm">...</span>}
                </>
              )}
              
              {generatePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm border rounded-lg ${
                    page === currentPage
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 py-2 text-sm">...</span>}
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* 下一頁 */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 