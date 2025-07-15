'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無法載入文章</h2>
        <p className="text-gray-600 mb-6">載入文章時發生錯誤</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          重試
        </button>
      </div>
    </div>
  );
} 