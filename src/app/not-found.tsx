import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">找不到頁面</h2>
        <p className="text-gray-600 mb-6">抱歉，您要找的頁面不存在</p>
        <Link
          href="/"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors inline-block"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
} 