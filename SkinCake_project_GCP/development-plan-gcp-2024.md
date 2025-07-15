# SkinCake 網站重構開發企劃書 2025 - 核心聚焦版

## 專案概述

### 願景
在 2025 年，打造一個現代化、高性能、SEO 友好的韓國美容旅遊資訊平台，結合 Google Cloud Platform 的強大運算能力與 Cloudflare 的頂級全球網路，提供極致的核心用戶體驗。

### 核心目標 (2025 V1)
1.  **頂級 SEO 優化**：實現 SSG/ISR 混合渲染，確保內容被搜尋引擎正確索引並獲得高排名。
2.  **極致性能**：利用 Cloudflare 全球 CDN，結合 GCP 的快速運算，實現全球極速載入。
3.  **卓越的核心用戶體驗**：專注打磨四大核心頁面（首頁、文章、分類、店家），確保功能完善、互動流暢。
4.  **高可維護性**：建立一個易於維護和未來擴展的模組化架構。
5.  **高可用性與安全性**：利用 GCP 的自動擴展和 Cloudflare 的 WAF/DDoS 防護應對各種情況。

## 技術架構

### 技術棧選擇
- **框架**：Next.js 14（穩定版本）
- **部署**：Google Cloud Run（容器化部署）
- **CDN & 安全**：Cloudflare（CDN, WAF, DNS）
- **資料庫**：Google Cloud SQL（MySQL 8.0）
- **檔案儲存**：Google Cloud Storage
- **快取**：Google Cloud Memorystore（Redis）
- **樣式**：Tailwind CSS v3 + 自定義設計系統
- **資料來源**：WordPress REST API (Headless CMS)
- **狀態管理**：Zustand（輕量級）
- **分析**：Google Analytics 4
- **監控**：Google Cloud Monitoring + Cloud Logging

### GCP + Cloudflare 混合雲架構圖
```
用戶請求 → Cloudflare (DNS, WAF, CDN) → Google Cloud Run → WordPress API
                                               ↑
                                         Cloud SQL (用於快取/可選)
                                               ↑
                                          Cloud Storage (圖片)
```

### 渲染策略 (SEO 優化核心)
-   **文章頁 (Article Page)**：**SSG (靜態網站生成) + ISR (增量靜態再生)**。這是針對性能和 SEO 的最佳實踐。我們會為熱門文章預先生成靜態頁面，新文章或冷門文章則在第一次訪問時生成並快取。這在 Cloud Run 等 Serverless 環境中運行良好，確保了極快的載入速度和最新的內容。
-   **首頁 (Home Page)**：**ISR (增量靜態再生)**，例如每小時自動重新生成一次，確保內容的即時性，並由 Cloudflare 在全球進行快取。
-   **分類頁 & 店家頁 (Category & Brand Pages)**：**SSG + ISR**，與文章頁策略相同，確保這些重要的入口頁面擁有最快的速度。

---

## V1 核心功能開發 (2025 專案重點)

### 1. 首頁 (Home Page)
打造一個內容豐富且引人入勝的門戶。
#### 組件結構
-   `<NavigationBar />`：清晰的網站導航。
-   `<SearchBar />`：提供基礎的全站文章標題搜尋功能。
-   `<HeroCarousel />`：主視覺輪播圖，展示最新活動或精選內容。
-   `<FeaturedSection />`：**SkinCake 精選推薦**，手動精選或基於熱門度的文章列表。
-   `<CakeNews />`：**蛋糕報報**，按時間倒序排列的最新文章流。
-   `<ExploreByRegion />`：**從地區開始探索**，引導用戶至不同地區分類。
-   `<SkinMap />`：**SkinCake 肌膚地圖**，一個視覺化的地圖，標示出重要的地點或店家。
-   `<SecretRecommends />`：**偷偷推薦給你**，初期可實現為隨機展示一些評價高的文章或店家。
-   `<Footer />`：頁尾資訊。

### 2. 文章頁面 (Article Page)
提供極致的閱讀體驗，並針對 SEO 進行深度優化。
#### 組件結構
-   `<ArticleHeader />`：包含標題、作者、發布日期和麵包屑導航。
-   `<ArticleContent />`：完美渲染從 WordPress 傳來的富文本內容。
-   `<ShareButtons />`：方便用戶分享到各大社交平台。
-   `<RelatedArticles />`：**V1 實現**：基於相同分類或標籤的相關文章推薦。
-   `<TagCloud />`：展示該篇文章關聯的標籤。

### 3. 分類頁面 (Category Page)
讓用戶可以輕鬆地探索和篩選內容。
#### 組件結構
-   `<CategoryHeader />`：顯示分類的標題和描述。
-   `<PopularKeywords />`：展示該分類下的**熱門旅遊關鍵字**或子標籤。
-   `<InteractiveTagCloud />`：一個**互動式的標籤雲**，用戶點擊標籤後，下方的文章列表會動態篩選。
-   `<ArticleGrid />`：以卡片形式展示篩選後的文章列表。
-   `<Pagination />`：分頁或「載入更多」功能。

### 4. 店家頁面 (Brand Page)
為合作的醫美品牌或店家提供一個專業的展示頁面。
#### 組件結構
-   `<BrandHero />`：品牌的主視覺和 Logo。
-   `<BrandInfo />`：診所的詳細資訊（地址、電話、營業時間、網站連結）。
-   `<LocationMap />`：嵌入 Google Maps 顯示地理位置。
-   `<ServiceShowcase />`：以圖文並茂的方式展示其服務項目。
-   `<DoctorProfiles />`：醫師團隊介紹。
-   `<CustomerReviews />`：展示顧客評價（初期可手動輸入或引用 Google 評價）。

---

## V2 階段性目標 (未來升級方向)

以下功能在本次開發中將**暫不實現**，留待未來版本升級，以確保 V1 的交付品質。

-   **AI 智能推薦**：升級`RelatedArticles`和`SecretRecommends`，從基於規則的推薦升級為使用 **Cloud AI Platform** 的個性化推薦。
-   **進階搜尋**：將基礎搜尋升級為整合 **Cloud Search API** 或 **Algolia**，提供更快速、更智能的全文搜尋體驗。
-   **多語言支援**：整合 **Cloud Translation API** 提供自動翻譯功能。
-   **進階評論系統**：整合 **Cloud Firestore** 實現即時評論功能。
-   **CI/CD 自動化**：建立完整的 Cloud Build 自動化部署流水線。

## 成功指標 (V1)

### 性能目標
-   **Lighthouse 分數**: > 90
-   **Core Web Vitals**: 所有指標均為「良好 (Good)」。
-   **頁面載入時間**: 全球平均 < 2 秒。

### SEO 目標
-   **Google 索引率**: 核心頁面 > 98%。
-   **結構化資料**: 文章頁和店家頁包含有效的結構化資料。

### 功能目標
-   四大核心頁面的所有 V1 功能全部上線且運作穩定。
-   後台 WordPress 的內容能順利同步並顯示在前端頁面。 