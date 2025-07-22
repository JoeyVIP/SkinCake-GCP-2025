'use client';

import { useState } from 'react';
import { WPPost, WPCategory } from '@/lib/wordpress-api';
import CategoryArticleGrid from './CategoryArticleGrid';
import CategoryPagination from './CategoryPagination';

interface CategoryClientContainerProps {
  initialPosts: WPPost[];
  currentCategory: WPCategory;
  totalPages: number;
}

export default function CategoryClientContainer({ 
  initialPosts, 
  currentCategory, 
  totalPages 
}: CategoryClientContainerProps) {
  const [posts, setPosts] = useState<WPPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPosts: WPPost[], page: number) => {
    setPosts(newPosts);
    setCurrentPage(page);
    // 滾動到頂部
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 文章網格 */}
      <CategoryArticleGrid 
        posts={posts}
        currentCategory={currentCategory}
      />
      
      {/* 分頁組件 */}
      <CategoryPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        categorySlug={currentCategory.slug}
        categoryId={currentCategory.id}
        onPageChange={handlePageChange}
      />
    </>
  );
} 