import { WPPost } from '@/lib/wordpress-api';
import ArticleCard from '@/components/features/ArticleCard';

interface ArticleGridProps {
  posts: WPPost[];
}

export default function ArticleGrid({ posts }: ArticleGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">目前還沒有文章</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
} 