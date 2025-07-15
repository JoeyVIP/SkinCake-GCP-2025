import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">關於我們</h3>
            <ul className="space-y-2">
              <li><Link href="/about">關於 SkinCake</Link></li>
              <li><Link href="/contact">聯絡我們</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">探索更多</h3>
            <ul className="space-y-2">
              <li><Link href="/category/1">韓系美容</Link></li>
              <li><Link href="/category/3">韓國美食</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">合作夥伴</h3>
            <ul className="space-y-2">
              <li><Link href="/partner">品牌合作</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">關注我們</h3>
            {/* Social media icons here */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} SkinCake. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
} 