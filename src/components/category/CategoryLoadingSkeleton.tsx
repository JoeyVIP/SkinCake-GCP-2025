export default function CategoryLoadingSkeleton() {
  return (
    <div className="bg-[#FFF9FA] min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 熱門旅遊關鍵字載入動畫 */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="w-16 h-1 bg-gray-200 mx-auto rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index}
                className="h-10 bg-gray-200 rounded-full animate-pulse"
                style={{ width: `${Math.random() * 60 + 80}px` }}
              ></div>
            ))}
          </div>
        </section>

        {/* 文章網格載入動畫 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              {/* 圖片載入動畫 */}
              <div className="w-full aspect-square bg-gray-200"></div>
              
              {/* 內容載入動畫 */}
              <div className="p-4">
                {/* 分類標籤 */}
                <div className="w-16 h-5 bg-gray-200 rounded-full mb-2"></div>
                
                {/* 日期 */}
                <div className="w-20 h-3 bg-gray-200 rounded mb-3"></div>
                
                {/* 標題 */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分頁載入動畫 */}
        <div className="flex justify-center items-center mt-12 space-x-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
} 