import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  title: string;
  link: string;
  image: string;
  alt: string;
}

export default function CategoryCards() {
  const categories: Category[] = [
    {
      id: 'korean-beauty',
      title: '韓系美容',
      link: '/category/韓系美容',
      image: '/images/choice01.jpg',
      alt: '韓系美容'
    },
    {
      id: 'beauty-care',
      title: '美妝保養',
      link: '/category/美妝保養',
      image: '/images/choice02.jpg',
      alt: '美妝保養'
    },
    {
      id: 'korean-food',
      title: '韓國美食',
      link: '/category/韓國美食',
      image: '/images/choice03.jpg',
      alt: '韓國美食'
    },
    {
      id: 'korean-shopping',
      title: '韓國購物',
      link: '/category/韓國購物',
      image: '/images/choice04.jpg',
      alt: '韓國購物'
    },
    {
      id: 'travel-essentials',
      title: '旅遊必備',
      link: '/category/旅遊必備',
      image: '/images/choice05.jpg',
      alt: '旅遊必備'
    },
    {
      id: 'idol-style',
      title: '愛豆同款',
      link: '/category/愛豆同款',
      image: '/images/choice06.jpg',
      alt: '愛豆同款'
    }
  ];

  return (
    <div className="max-w-[1080px] mx-auto px-4 pt-4 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="category-card bg-white rounded-lg shadow-md overflow-hidden"
            id={category.id}
          >
            <Link href={category.link} className="block hover:shadow-lg transition-shadow">
              <div className="relative w-full h-40">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base text-gray-800 font-normal category-title">{category.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 