import Link from 'next/link';
import { WPCategory } from '@/lib/wordpress-api';

interface RelatedCategoriesProps {
  categories: WPCategory[];
  currentCategoryId: number;
}

export default function RelatedCategories({ 
  categories, 
  currentCategoryId 
}: RelatedCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">相關分類</h3>
      <div className="space-y-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors group"
          >
            <div>
              <h4 className="font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
                {category.name}
              </h4>
              <p className="text-sm text-gray-500">
                {category.count} 篇文章
              </p>
            </div>
            <span className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
} 