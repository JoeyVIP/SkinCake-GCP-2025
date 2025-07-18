export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#FFF9FA]">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 熱門旅遊關鍵字載入狀態 */}
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
        
        {/* 文章網格載入狀態 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 