import { WPCategory } from '@/lib/wordpress-api';

interface CategoryHeaderProps {
  category: WPCategory;
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {category.name}
      </h1>
      <p className="text-gray-600 text-lg">
        共有 {category.count} 篇文章
      </p>
      <div className="w-20 h-1 bg-pink-500 mx-auto mt-4"></div>
    </div>
  );
} 