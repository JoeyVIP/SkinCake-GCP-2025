'use client';

import React from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareData = {
    title,
    url,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('分享失敗或用戶取消了分享');
      }
    } else {
      // Fallback: 複製連結到剪貼板
      try {
        await navigator.clipboard.writeText(url);
        alert('連結已複製到剪貼板！');
      } catch (error) {
        console.error('複製失敗:', error);
      }
    }
  };

  const shareToFacebook = () => {
    // 使用 Facebook 的完整分享 API，包含標題和描述
    const facebookUrl = `https://www.facebook.com/dialog/share?app_id=1938467216918441&href=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}&display=popup`;
    window.open(facebookUrl, '_blank', 'width=600,height=600,scrollbars=yes,resizable=yes');
  };

  const shareToThreads = () => {
    // Threads 分享 URL（Meta 的新平台）
    const threadsText = `${title}\n\n${url}`;
    const threadsUrl = `https://threads.net/intent/post?text=${encodeURIComponent(threadsText)}`;
    window.open(threadsUrl, '_blank', 'width=600,height=600,scrollbars=yes,resizable=yes');
  };

  const shareToLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
    window.open(lineUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">分享這篇文章</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          分享
        </button>
        
        <button
          onClick={shareToFacebook}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Facebook
        </button>
        
        <button
          onClick={shareToThreads}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
        >
          Threads
        </button>
        
        <button
          onClick={shareToLine}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          LINE
        </button>
      </div>
    </div>
  );
} 