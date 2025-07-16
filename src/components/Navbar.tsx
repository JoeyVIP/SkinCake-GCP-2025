'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: '韓系美容', href: '/category/%E9%9F%93%E7%B3%BB%E7%BE%8E%E5%AE%B9/' },
    { name: '美妝保養', href: '/category/%E7%BE%8E%E5%A6%9D%E4%BF%9D%E9%A4%8A/' },
    { name: '韓國美食', href: '/category/%E9%9F%93%E5%9C%8B%E7%BE%8E%E9%A3%9F/' },
    { name: '韓國購物', href: '/category/%E9%9F%93%E5%9C%8B%E8%B3%BC%E7%89%A9/' },
    { name: 'Cakery', href: '/category/Cakery/' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img
                className="h-10 w-auto"
                src="/images/main_skincake_logo.png"
                alt="SKIN CAKE Logo"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-baseline space-x-8">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#FFA4B3] transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center">
            <div className="hidden md:block">
              <Link href="/login" className="text-gray-700 hover:text-[#FFA4B3]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 hover:text-[#FFA4B3] hover:bg-gray-100">
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FFA4B3] hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={toggleMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FFA4B3] hover:bg-gray-50"
            >
              登入
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 