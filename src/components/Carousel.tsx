'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CarouselSlide {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 輪播數據
  const carouselData: CarouselSlide[] = [
    {
      title: "第一次去韓國變漂亮？",
      description: "新手看這篇最實用",
      image: "/images/bn01.jpg",
      link: "/category/韓系美容"
    },
    {
      title: "韓國最好逛的都在這裡",
      description: "不踩雷推薦",
      image: "/images/bn02.jpg",
      link: "/category/韓國購物"
    },
    {
      title: "韓國自由行美食地圖",
      description: "跑咖、獨旅、24hr美食",
      image: "/images/bn03.jpg",
      link: "/category/韓國美食"
    }
  ];

  // 自動輪播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselData.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      {/* 輪播容器 */}
      <div className="relative h-full">
        {/* 輪播圖片 */}
        <div className="carousel-container h-full">
          {carouselData.map((slide, index) => (
            <Link
              key={index}
              href={slide.link}
              className={`carousel-slide absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onError={(e) => {
                console.error('Carousel image failed to load:', slide.image);
              }}
            />
          ))}
        </div>

        {/* 輪播文字和搜尋框 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center mb-12">
            <h1 className="carousel-title text-4xl md:text-5xl text-white font-bold mb-8 text-center">
              <Link href={carouselData[currentSlide].link} className="text-white hover:text-white/80 transition-colors">
                {carouselData[currentSlide].title}
              </Link>
            </h1>
            <p className="carousel-description text-xl text-white mb-8">
              <Link href={carouselData[currentSlide].link} className="text-white hover:text-white/80 transition-colors">
                {carouselData[currentSlide].description}
              </Link>
            </p>
          </div>

          {/* 搜尋框 */}
          <div className="w-full max-w-2xl mx-auto px-4">
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                id="search-input"
                name="search-query"
                placeholder="搜尋景點、美食、住宿..."
                className="w-full h-[46px] px-6 rounded-l-lg focus:outline-none text-base border-0"
              />
              <button
                type="submit"
                id="search-button"
                className="flex items-center justify-center bg-[#FFA4B3] hover:bg-[#FF8599] text-white h-[46px] px-8 rounded-r-lg text-base font-medium border-0 whitespace-nowrap transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* 輪播指示器 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-indicator w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* 左右控制按鈕 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
} 