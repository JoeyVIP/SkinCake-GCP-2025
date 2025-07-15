# SkinCake 網站重構開發企劃書 2024

## 專案概述

### 願景
打造一個現代化、高性能、SEO 友好的韓國美容旅遊資訊平台，提供優質的內容瀏覽體驗。

### 核心目標
1. **SEO 優化**：實現 SSG/ISR 混合渲染，確保內容被搜尋引擎正確索引
2. **性能提升**：利用 Cloudflare Workers 邊緣計算，實現極速載入
3. **用戶體驗**：保留原有優秀功能，提升互動體驗
4. **可維護性**：模組化架構，便於後續維護和擴展

## 技術架構

### 技術棧選擇
- **框架**：Next.js 14（穩定版本，避免 15 的兼容性問題）
- **部署**：Cloudflare Workers（使用 @cloudflare/next-on-pages）
- **樣式**：Tailwind CSS v3 + 自定義設計系統
- **資料來源**：WordPress REST API
- **狀態管理**：Zustand（輕量級）
- **分析**：GA4 + Facebook Pixel

### 渲染策略
```
首頁：ISR（每小時更新）
文章頁：SSG + ISR（新文章即時生成）
分類頁：SSG + 客戶端篩選
店家頁：SSG（靜態內容）
```

## 頁面規劃

### 1. 首頁（Home Page）

#### 組件結構
```
<HomePage>
  ├── <NavigationBar />          // 導航欄（桌面/手機響應式）
  ├── <SearchBar />              // 全站搜尋功能
  ├── <HeroCarousel />           // 主視覺輪播（3張橫幅）
  ├── <FeaturedSection />        // SkinCake 精選推薦
  ├── <CakeNews />               // 蛋糕報報（最新文章）
  ├── <ExploreByRegion />        // 從地區開始探索
  ├── <SkinMap />                // SkinCake 肌膚地圖
  ├── <SecretRecommends />       // 偷偷推薦給你
  └── <Footer />                 // 頁尾資訊
</HomePage>
```

#### 特色功能
- **智能推薦**：基於用戶瀏覽記錄的個性化推薦
- **即時搜尋**：支援文章標題、內容、標籤的模糊搜尋
- **動態載入**：首屏快速渲染，其他區塊延遲載入

### 2. 文章頁面（Article Page）

#### SSG/ISR 實現策略
```typescript
// 預先生成熱門文章（前 100 篇）
export async function generateStaticParams() {
  const posts = await getPopularPosts(100);
  return posts.map(post => ({ slug: post.slug }));
}

// ISR：其他文章按需生成，快取 1 小時
export const revalidate = 3600;
```

#### 組件結構
```
<ArticlePage>
  ├── <ArticleHeader />          // 標題、作者、日期、標籤
  ├── <ArticleContent />         // 文章主體（支援富文本）
  ├── <ShareButtons />           // 社交分享按鈕
  ├── <RelatedArticles />        // 相關文章推薦（6篇）
  ├── <TagCloud />               // 相關標籤雲
  └── <Comments />               // 評論系統（可選）
</ArticlePage>
```

#### SEO 優化
- 結構化資料（JSON-LD）
- Open Graph 標籤
- 自動生成 meta description
- 圖片延遲載入與 WebP 格式

### 3. 分類頁面（Category Page）

#### 組件結構
```
<CategoryPage>
  ├── <CategoryHeader />         // 分類標題與描述
  ├── <PopularKeywords />        // 熱門旅遊關鍵字
  ├── <InteractiveTagCloud />    // 互動式標籤雲
  ├── <FilterBar />              // 篩選條件（日期、熱門度等）
  ├── <ArticleGrid />            // 文章卡片網格
  └── <LoadMore />               // 載入更多按鈕
</CategoryPage>
```

#### 特色功能
- **標籤雲互動**：點擊標籤即時篩選文章
- **多重篩選**：支援標籤、日期、熱門度組合篩選
- **無限滾動**：優雅的載入更多體驗

### 4. 店家頁面（Brand Page）

#### 組件結構
```
<BrandPage>
  ├── <BrandHero />              // 品牌主視覺
  ├── <BrandInfo />              // 診所資訊（地址、電話、營業時間）
  ├── <LocationMap />            // 地圖（Google Maps + Naver Map）
  ├── <ServiceShowcase />        // 服務項目展示
  ├── <DoctorProfiles />         // 醫師團隊介紹
  ├── <CustomerReviews />        // 顧客評價
  └── <BookingCTA />             // 預約行動呼籲
</BrandPage>
```

#### 特色功能
- **多語言支援**：中文、韓文切換
- **地圖整合**：同時支援 Google 和 Naver 地圖
- **評價系統**：整合 Google Reviews API

### 5. 文章卡片組件（Article Card）

#### 設計系統
```typescript
// 統一的文章卡片組件，支援多種顯示模式
<ArticleCard 
  variant="default|compact|featured|horizontal"
  article={articleData}
  showTags={true}
  showExcerpt={true}
  imageSize="small|medium|large"
/>
```

#### 變體說明
- **Default**：標準卡片（首頁精選）
- **Compact**：緊湊版（側邊欄推薦）
- **Featured**：特色版（置頂文章）
- **Horizontal**：橫向版（列表顯示）

## 實施策略

### 第一階段：基礎建設（2週）
1. 建立 Next.js 14 專案架構
2. 配置 Cloudflare Workers 部署
3. 實現 WordPress API 整合層
4. 建立設計系統和組件庫

### 第二階段：核心頁面（3週）
1. 實現首頁所有組件
2. 完成文章頁 SSG/ISR 邏輯
3. 實現分類頁面和標籤系統
4. 整合搜尋功能

### 第三階段：進階功能（2週）
1. 實現店家頁面模板
2. 整合分析追蹤代碼
3. 優化性能和 SEO
4. 實現 PWA 功能

### 第四階段：測試優化（1週）
1. 全面測試和錯誤修復
2. 性能優化和壓力測試
3. SEO 檢查和優化
4. 部署和監控設置

## 技術亮點

### 1. 邊緣渲染優化
```typescript
// 利用 Cloudflare KV 快取常用資料
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sin1', 'hkg1'] // 覆蓋美國、新加坡、香港
};
```

### 2. 智能圖片優化
```typescript
// 自動 WebP 轉換和響應式圖片
<Image
  src={article.image}
  alt={article.title}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
  placeholder="blur"
/>
```

### 3. 預載入策略
```typescript
// 智能預載入可能訪問的頁面
const prefetchArticle = (slug: string) => {
  router.prefetch(`/blog/${slug}`);
};
```

## 成功指標

### 性能目標
- Lighthouse 分數 > 95
- 首次內容繪製 < 1.5s
- 完全載入時間 < 3s

### SEO 目標
- Google 索引率 > 95%
- 結構化資料驗證通過
- Core Web Vitals 全綠

### 用戶體驗
- 跳出率降低 20%
- 平均停留時間增加 30%
- 頁面瀏覽量增加 40%

## 風險管理

### 技術風險
1. **Workers 限制**：準備 fallback 方案
2. **API 穩定性**：實現快取和錯誤處理
3. **瀏覽器兼容**：確保支援主流瀏覽器

### 應對策略
- 建立完整的錯誤邊界
- 實現優雅降級
- 準備靜態備份方案

## 結語

這個企劃旨在打造一個現代化、高性能的 SkinCake 網站，不僅解決現有的技術債，更要創造卓越的用戶體驗。通過合理的技術選型和漸進式實施，我們有信心交付一個優秀的產品。 