import { getRecentPosts } from "@/lib/wordpress-api";
import ArticleCard from "./ArticleCard";

export default async function CakeNews() {
  const posts = await getRecentPosts(6);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">蛋糕報報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
} 