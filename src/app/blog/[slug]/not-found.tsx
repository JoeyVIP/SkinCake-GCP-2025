import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">找不到文章</h2>
      <Link 
        href="/"
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        返回首頁
      </Link>
    </div>
  )
} 