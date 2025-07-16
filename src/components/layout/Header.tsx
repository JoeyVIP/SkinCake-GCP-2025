'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              className="h-10 w-auto"
              src="/images/main_skincake_logo.png"
              alt="SKIN CAKE Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/category/%E9%9F%93%E7%B3%BB%E7%BE%8E%E5%AE%B9" className="text-gray-600 hover:text-pink-500 transition-colors">韓系美容</Link>
            <Link href="/category/%E7%BE%8E%E5%A6%9D%E4%BF%9D%E9%A4%8A" className="text-gray-600 hover:text-pink-500 transition-colors">美妝保養</Link>
            <Link href="/category/%E9%9F%93%E5%9C%8B%E7%BE%8E%E9%A3%9F" className="text-gray-600 hover:text-pink-500 transition-colors">韓國美食</Link>
            <Link href="/category/%E9%9F%93%E5%9C%8B%E8%B3%BC%E7%89%A9" className="text-gray-600 hover:text-pink-500 transition-colors">韓國購物</Link>
            <Link href="/category/Cakery" className="text-gray-600 hover:text-pink-500 transition-colors">Cakery</Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* User Avatar */}
          <div className="hidden md:flex items-center">
            <button className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-gray-600 hover:text-pink-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜尋文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <Link href="/category/%E9%9F%93%E7%B3%BB%E7%BE%8E%E5%AE%B9" className="text-gray-600 hover:text-pink-500 transition-colors">韓系美容</Link>
              <Link href="/category/%E7%BE%8E%E5%A6%9D%E4%BF%9D%E9%A4%8A" className="text-gray-600 hover:text-pink-500 transition-colors">美妝保養</Link>
              <Link href="/category/%E9%9F%93%E5%9C%8B%E7%BE%8E%E9%A3%9F" className="text-gray-600 hover:text-pink-500 transition-colors">韓國美食</Link>
              <Link href="/category/%E9%9F%93%E5%9C%8B%E8%B3%BC%E7%89%A9" className="text-gray-600 hover:text-pink-500 transition-colors">韓國購物</Link>
              <Link href="/category/Cakery" className="text-gray-600 hover:text-pink-500 transition-colors">Cakery</Link>
              
              {/* Mobile User Profile */}
              <div className="pt-4 border-t border-gray-200">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>登入</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 