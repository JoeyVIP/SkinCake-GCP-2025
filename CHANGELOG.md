# Changelog

## [v2.3.0] - 2025-01-20

### 🚀 重大 CSS 性能優化 & 建置修復
**目標：解決 PageSpeed 報告的 1.74 秒 CSS 阻塞渲染問題**

#### ✅ 關鍵 CSS 內聯優化
- **內聯關鍵 CSS** (~3KB)：基礎版面、顏色系統、響應式網格直接嵌入 HTML
- **延遲載入完整 Tailwind**：非關鍵樣式延後 2 秒或用戶互動時載入
- **DNS 預連接**：預連 Google Fonts、Jetpack CDN、GA、FB Pixel 等關鍵資源

#### ⚡ Analytics 延遲載入
- **GA4 延遲載入**：3 秒後或用戶互動時載入，避免阻塞首屏渲染
- **Facebook Pixel 延遲載入**：同樣策略，減少初始 JS 大小
- **保留完整功能**：頁面追蹤、事件監控、除錯工具等功能不變

#### 🔧 Tailwind CSS 最佳化
- **移除不必要模組**：backdrop-blur、scroll-snap、user-select 等 13 個模組
- **精簡 CSS 輸出**：預期減少 ~30% CSS 檔案大小
- **保留核心功能**：版面、顏色、響應式等關鍵樣式完整保留

#### 🐛 分類頁面建置修復
- **移除 searchParams 依賴**：修復 Dynamic Server Usage 錯誤
- **客戶端分頁**：改用 AJAX 載入分頁內容，支援無刷新翻頁
- **滾動優化**：分頁切換自動回到頂部

#### 📊 預期性能提升
- **LCP 改善**：關鍵 CSS 內聯應能顯著改善首屏載入
- **FCP 提升**：延遲載入策略減少阻塞時間
- **JS Bundle 減少**：延遲載入策略降低初始載入負擔

#### 🛠️ 技術實現
- 新增 `LazyCSS` 組件處理延遲載入
- 新增 `CategoryClientContainer` 管理分類頁狀態
- 升級 Analytics 組件為智能延遲載入
- 優化 `layout.tsx` 實現關鍵路徑優化

#### 📋 待後續測試
- PageSpeed Insights 分數改善情況
- 實際 LCP/FCP 指標變化
- 用戶體驗影響評估

---

## [v2.2.4] - 2025-01-19

### ✅ GA4 & Facebook Pixel 完整實作
- **Google Analytics 4 (G-CS0NRJ05FE)** 完整配置與事件追蹤
- **Facebook Pixel (1879313576190232)** 頁面瀏覽追蹤
- **搜尋事件追蹤**：search、search_result_click
- **社群分享追蹤**：share 事件含平台參數
- **外鏈點擊追蹤**：自動追蹤站外連結
- **除錯工具**：window.gaDebug() 便於開發測試

### 🔧 性能優化
- **圖片 CDN 優化**：集成 Jetpack Photon，自動 WebP/AVIF 轉換
- **圖片壓縮**：quality=60, width=1200 大幅減少圖片大小
- **CLS 修復**：圖片 aspect-ratio 預防版面位移
- **LCP 優化**：關鍵圖片 fetchPriority="high" + preload

### 🐛 建置問題修復
- **修復 Dynamic Server Usage**：getRandomPosts 條件快取策略
- **修復 Analytics Suspense**：客戶端處理 searchParams
- **修復 RandomRelatedPosts**：改為純客戶端載入
- **修復 Facebook App ID**：更新為正確 ID (1938467216918441)

### 📱 用戶體驗改善
- **點擊回頂部**：推薦文章點擊自動滾動到頂部
- **分頁載入最佳化**：改善分類頁面分頁體驗
- **錯誤處理**：強化 API 錯誤處理機制

---

## [v2.2.3] - 2025-01-18
- 修復部署過程中的建置錯誤
- 完善 WordPress API 資料獲取邏輯

## [v2.2.2] - 2025-01-17
- 增強網站 SEO 設定
- 改善圖片載入效能

## [v2.2.1] - 2025-01-16
- 優化網站載入速度
- 修復已知 bug

## [v2.2.0] - 2025-01-15
- 新增分類頁面功能
- 改善網站導航結構

## [v2.1.0] - 2025-01-10
- 升級至 Next.js 14
- 改善整體效能表現 