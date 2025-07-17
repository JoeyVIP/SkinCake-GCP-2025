# 故障排除指南

本指南幫助您解決 SkinCake 專案中的常見問題。

## 常見問題

### 開發環境問題

#### 1. npm install 失敗

**問題描述**: 執行 `npm install` 時出現錯誤

**解決方案**:
```bash
# 清理 npm 快取
npm cache clean --force

# 刪除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安裝
npm install

# 如果仍有問題，嘗試使用 npm ci
npm ci
```

#### 2. 開發伺服器無法啟動

**問題描述**: `npm run dev` 無法啟動或端口被佔用

**解決方案**:
```bash
# 檢查 3000 端口是否被佔用
lsof -i :3000

# 終止佔用端口的進程
kill -9 <PID>

# 或使用其他端口
PORT=3001 npm run dev
```

#### 3. TypeScript 錯誤

**問題描述**: TypeScript 編譯錯誤

**解決方案**:
```bash
# 重新生成 TypeScript 定義
npm run type-check

# 清理 Next.js 快取
rm -rf .next

# 重啟 TypeScript 服務（在 VS Code 中）
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### API 相關問題

#### 1. WordPress API 連接失敗

**問題描述**: 無法從 WordPress API 獲取數據

**診斷步驟**:
```bash
# 測試 API 端點
curl https://skincake.online/wp-json/wp/v2/posts

# 檢查環境變數
echo $WORDPRESS_API_URL
```

**解決方案**:
- 確認 WordPress 網站正常運行
- 檢查 `.env.local` 中的 API URL
- 確認網路連接正常
- 檢查 CORS 設置

#### 2. 圖片載入失敗

**問題描述**: 圖片無法顯示或 404 錯誤

**解決方案**:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['skincake.online', 'your-cdn.com'],
    // 添加所有圖片來源域名
  },
}
```

### 構建和部署問題

#### 1. 構建失敗

**問題描述**: `npm run build` 失敗

**常見原因和解決方案**:

```bash
# 1. 清理快取
rm -rf .next

# 2. 檢查環境變數
# 確保所有必要的環境變數都已設置

# 3. 檢查內存限制
# 增加 Node.js 內存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# 4. 檢查依賴版本
npm outdated
npm update
```

#### 2. 部署到 Vercel 失敗

**問題描述**: Vercel 部署錯誤

**檢查清單**:
- [ ] 環境變數是否在 Vercel 中設置
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Node.js Version: 18.x

#### 3. GCP Cloud Run 部署失敗

**問題描述**: Cloud Run 部署或運行錯誤

**解決方案**:
```bash
# 檢查 Docker 映像
docker build -t skincake-test .
docker run -p 3000:3000 skincake-test

# 檢查日誌
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# 檢查服務配置
gcloud run services describe skincake --region=asia-east1
```

### 性能問題

#### 1. 頁面載入緩慢

**診斷工具**:
- Chrome DevTools Performance
- Lighthouse
- Next.js Analytics

**優化建議**:
1. 啟用圖片優化
2. 實施代碼分割
3. 使用 ISR 快取
4. 優化 API 請求

#### 2. 高內存使用

**監控和優化**:
```javascript
// 監控內存使用
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const used = process.memoryUsage();
    console.log('Memory Usage:', {
      rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    });
  }, 10000);
}
```

### SEO 和索引問題

#### 1. 頁面未被索引

**檢查步驟**:
1. 確認 robots.txt 配置正確
2. 檢查 sitemap.xml 生成
3. 使用 Google Search Console 測試
4. 確認 meta 標籤正確

#### 2. Open Graph 標籤不工作

**除錯工具**:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 樣式問題

#### 1. Tailwind CSS 類不生效

**解決方案**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // 確保包含所有使用 Tailwind 的文件
  ],
  // ...
}
```

#### 2. 樣式衝突

**診斷方法**:
- 使用瀏覽器開發工具檢查 CSS 優先級
- 檢查是否有全域 CSS 覆蓋
- 使用 `!important` 臨時測試（不建議長期使用）

## 錯誤代碼參考

### HTTP 錯誤代碼

| 代碼 | 描述 | 可能原因 | 解決方案 |
|------|------|----------|----------|
| 400 | Bad Request | 請求參數錯誤 | 檢查 API 請求參數 |
| 401 | Unauthorized | 認證失敗 | 檢查 API 密鑰 |
| 404 | Not Found | 資源不存在 | 確認 URL 正確 |
| 500 | Server Error | 伺服器錯誤 | 檢查伺服器日誌 |

### Next.js 錯誤

| 錯誤 | 描述 | 解決方案 |
|------|------|----------|
| NEXT_NOT_FOUND | 頁面不存在 | 檢查路由配置 |
| NEXT_REDIRECT | 重定向錯誤 | 檢查重定向邏輯 |
| WEBPACK_ERROR | 構建錯誤 | 檢查導入路徑 |

## 日誌和監控

### 查看日誌

```bash
# 本地開發日誌
npm run dev

# Vercel 日誌
vercel logs

# GCP Cloud Run 日誌
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

### 設置監控

1. **Google Analytics**: 追蹤用戶行為
2. **Sentry**: 錯誤監控
3. **Cloud Monitoring**: 系統性能監控

## 獲取幫助

如果以上解決方案無法解決您的問題：

1. 查看 [GitHub Issues](https://github.com/JoeyVIP/SkinCake-GCP-2025/issues)
2. 創建新的 Issue 並提供：
   - 錯誤訊息
   - 重現步驟
   - 環境資訊
   - 相關日誌

---

記住：大多數問題都有解決方案，保持耐心並系統性地排查問題！ 