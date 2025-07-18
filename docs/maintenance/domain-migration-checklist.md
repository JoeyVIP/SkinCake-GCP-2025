# 網域遷移檢查清單 - 從開發環境到生產環境

## 📋 概述

本文件記錄了從開發環境 (`skincake.vip`) 遷移到生產環境 (`skincake.tw`) 時需要檢查和修改的所有設定。

## 🚫 當前開發環境的防索引設定

### 1. 環境變數設定
```bash
# 當前開發環境
FRONTEND_DOMAIN=https://skincake.vip

# 轉移到生產環境時需要改為
FRONTEND_DOMAIN=https://skincake.tw
```

### 2. Meta Tags 防索引設定

#### A. 主要 Layout (`src/app/layout.tsx`)
**當前設定 (第 26-37 行):**
```typescript
robots: process.env.FRONTEND_DOMAIN?.includes('.vip') ? {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} : {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
},
```

#### B. 文章頁面 (`src/app/blog/[slug]/page.tsx`)
**當前設定 (第 108-122 行):**
```typescript
// 機器人設定 - 開發環境(.vip)禁止索引
robots: baseUrl.includes('.vip') ? {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} : {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
},
```

### 3. 動態 Robots.txt (`src/app/robots.txt/route.ts`)
**當前設定:**
```typescript
export async function GET() {
  const isVipEnvironment = process.env.FRONTEND_DOMAIN?.includes('.vip');
  
  if (isVipEnvironment) {
    // 開發環境 - 禁止所有機器人索引
    return new Response(
      `User-agent: *
Disallow: /

# 這是開發環境，禁止搜尋引擎索引
# Development environment - no indexing allowed
`,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }

  // 生產環境 - 允許索引但排除管理和 API 路徑
  return new Response(
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# 網站地圖
Sitemap: ${process.env.FRONTEND_DOMAIN}/sitemap.xml
Sitemap: ${process.env.FRONTEND_DOMAIN}/server-sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
}
```

## 🚀 生產環境遷移步驟

### 步驟 1: 更新環境變數
1. 更新 `.env.local` (本地開發)
2. 更新 GCP Cloud Run 環境變數
3. 更新 `cloudbuild.yaml` 中的相關設定

### 步驟 2: GCP Cloud Run 網域設定
```bash
# 1. 驗證新網域
gcloud domains verify skincake.tw

# 2. 建立網域映射
gcloud beta run domain-mappings create \
  --service=skincake-app \
  --domain=skincake.tw \
  --region=asia-east1

# 3. 移除舊網域映射 (可選)
gcloud beta run domain-mappings delete \
  --domain=skincake.vip \
  --region=asia-east1
```

### 步驟 3: DNS 設定更新
```bash
# Cloudflare DNS 設定
類型: CNAME
名稱: @ (或 skincake.tw)
目標: ghs.googlehosted.com
代理狀態: 🔄 灰色雲朵 (僅限 DNS)
```

### 步驟 4: 驗證檢查清單

#### ✅ 技術檢查
- [ ] 網站可以通過新網域訪問
- [ ] SSL 憑證正常工作
- [ ] 所有內部連結指向新網域
- [ ] API 呼叫正常運作

#### ✅ SEO 檢查
- [ ] 確認 robots.txt 允許索引: `https://skincake.tw/robots.txt`
- [ ] 檢查 meta robots 標籤為 `index, follow`
- [ ] 網站地圖正確生成: `https://skincake.tw/sitemap.xml`
- [ ] Open Graph metadata 使用新網域

#### ✅ 功能檢查
- [ ] Facebook 分享功能正常
- [ ] 社交分享按鈕正常
- [ ] 圖片載入正常
- [ ] 分析追蹤代碼正常

### 步驟 5: SEO 遷移 (重要!)
1. **Google Search Console**
   - 添加新網域屬性 `skincake.tw`
   - 提交新的網站地圖
   - 監控索引狀態

2. **301 重定向** (如果需要)
   - 設定從 `skincake.vip` 到 `skincake.tw` 的重定向
   - 在 Cloudflare 中設定頁面規則

3. **社交媒體更新**
   - 更新 Facebook 頁面連結
   - 更新其他社交媒體資料

## ⚠️ 注意事項

### 重要提醒
1. **不要同時索引兩個網域** - 避免重複內容問題
2. **確認環境變數正確** - 所有 `FRONTEND_DOMAIN` 都要更新
3. **測試所有功能** - 特別是依賴網域的功能
4. **備份設定** - 在修改前備份當前設定

### 回滾計畫
如果遷移過程中出現問題：
1. 恢復環境變數到舊網域
2. 重新部署應用程式
3. 檢查 DNS 設定
4. 確認所有功能正常

## 📝 遷移記錄

### 計劃遷移日期
- [ ] 預計遷移日期: ___________
- [ ] 實際遷移日期: ___________
- [ ] 遷移完成日期: ___________

### 遷移狀態
- [ ] 環境變數更新完成
- [ ] GCP 網域映射完成
- [ ] DNS 設定完成
- [ ] 功能測試完成
- [ ] SEO 設定完成

---
**文件版本**: 1.0  
**最後更新**: 2025-01-18  
**下次檢查**: 遷移完成後 