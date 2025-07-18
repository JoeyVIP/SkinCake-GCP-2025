# Google Analytics 與 Facebook Pixel 設定文件

> 最後更新：2025-01-09  
> 版本：v2.2.2

## 📊 Google Analytics 4 設定

### 基本資訊
- **串流名稱**: 肌膚蛋糕
- **串流網址**: https://skincake.tw
- **串流 ID**: 10252773345
- **評估 ID**: G-CS0NRJ05FE

### 實作功能
1. **自動追蹤事件**：
   - `page_view` - 頁面瀏覽（含 SPA 路由變化）
   - `click` (outbound) - 外部連結點擊
   - `search` - 站內搜尋
   - `search_result_click` - 搜尋結果點擊
   - `share` - 社交分享（Facebook、Line、Threads）

2. **進階功能**：
   - 開發環境除錯模式
   - 即時事件記錄（控制台）
   - GA 除錯頁面：`/ga-debug`

### 程式碼位置
- 主要追蹤程式：`/src/components/Analytics.tsx`
- 搜尋追蹤：`/src/components/SearchResults.tsx`
- 分享追蹤：`/src/components/ShareButtons.tsx`
- 除錯工具：`/src/app/ga-debug/page.tsx`

## 📘 Facebook Pixel 設定

### 基本資訊
- **像素名稱**: SkinCake官網像素
- **像素編號**: 1879313576190232

### 實作功能
1. **標準事件**：
   - `PageView` - 自動追蹤所有頁面瀏覽
   
2. **整合位置**：
   - Facebook 分享按鈕使用正確的 app_id
   - Open Graph meta tags 包含 fb:app_id

## 🔍 驗證方法

### GA4 驗證
1. **即時報告**：
   ```
   Google Analytics > 即時 > 總覽
   ```

2. **控制台驗證**：
   ```javascript
   // 檢查 GA 狀態
   window.gaDebug.checkStatus()
   
   // 發送測試事件
   window.gaDebug.testEvent()
   ```

3. **除錯頁面**：
   - 開發環境：http://localhost:3000/ga-debug
   - 生產環境：https://skincake.tw/ga-debug

### Facebook Pixel 驗證
1. 使用 [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome 擴充功能
2. 檢查 Facebook Events Manager

## 📝 注意事項

1. **環境變數**：
   - GA 和 FB Pixel 代碼直接寫在程式碼中
   - 未使用環境變數（考量 Next.js client-side 限制）

2. **隱私合規**：
   - 考慮未來加入 Cookie 同意橫幅
   - 遵守 GDPR 和其他隱私法規

3. **效能考量**：
   - 使用 Next.js Script 組件的 `afterInteractive` 策略
   - 避免阻塞頁面載入

## 🚀 未來建議

1. **GA4 進階設定**：
   - 設定轉換事件（搜尋、分享）
   - 建立自訂維度（文章分類、作者）
   - 設定受眾區隔

2. **Facebook Pixel 進階**：
   - 實作 ViewContent 事件（文章閱讀）
   - 加入 Search 事件
   - 設定自訂轉換

3. **其他追蹤工具**：
   - 考慮加入 Microsoft Clarity（熱點圖）
   - Line Tag（針對台灣市場）
   - Google Tag Manager（統一管理）

## 📌 相關連結

- [GA4 官方文件](https://developers.google.com/analytics/devguides/collection/ga4)
- [Facebook Pixel 文件](https://developers.facebook.com/docs/facebook-pixel)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics) 