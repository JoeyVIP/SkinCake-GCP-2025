'use client';

import { WPPost } from '@/lib/wordpress-api';

interface BlogPostClientProps {
  post: WPPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const handleFixedShare = async () => {
    if (!post) return;
    
    const shareData = {
      title: post.title.rendered,
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('分享失敗或用戶取消了分享');
      }
    } else {
      // Fallback: 複製連結到剪貼板
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('連結已複製到剪貼板！');
      } catch (error) {
        console.error('複製失敗:', error);
      }
    }
  };

  return (
    <>
      {/* 固定分享按鈕 - 右下角小圖標 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={handleFixedShare}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 p-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
          title="分享文章"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      </div>
    </>
  );
} 