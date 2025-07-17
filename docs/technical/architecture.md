# 系統架構

## 架構概覽

SkinCake v2 採用現代化的前後端分離架構，使用 Next.js 14 作為前端框架，WordPress 作為內容管理系統。

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   客戶端    │────▶│   Next.js    │────▶│  WordPress  │
│  (瀏覽器)   │◀────│   應用程式    │◀────│   REST API  │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │                     │
       │                    ▼                     │
       │            ┌──────────────┐              │
       └───────────▶│   CDN/快取    │◀─────────────┘
                    └──────────────┘
```

## 技術棧詳解

### 前端技術

#### Next.js 14
- **App Router**: 新一代路由系統
- **Server Components**: 伺服器端渲染組件
- **Streaming**: 漸進式渲染
- **Metadata API**: SEO 優化

#### React 18
- **Hooks**: 狀態管理
- **Suspense**: 異步組件載入
- **Concurrent Features**: 並發渲染

#### TypeScript 5
- **類型安全**: 完整的類型定義
- **IntelliSense**: 開發時提示
- **錯誤預防**: 編譯時錯誤檢查

#### Tailwind CSS 3
- **Utility-First**: 實用優先設計
- **JIT Mode**: 即時編譯
- **響應式設計**: 內建斷點系統

### 後端整合

#### WordPress REST API
```typescript
// API 端點結構
const API_BASE = 'https://skincake.online/wp-json/wp/v2';

// 主要端點
/posts          // 文章
/categories     // 分類
/tags          // 標籤
/media         // 媒體
/pages         // 頁面
```

### 渲染策略

#### 混合渲染模式

1. **靜態生成 (SSG)**
   - 首頁
   - 分類頁面
   - 靜態內容

2. **增量靜態再生 (ISR)**
   - 文章頁面
   - 動態內容
   - 快取時間：60 秒

3. **客戶端渲染 (CSR)**
   - 搜尋功能
   - 互動組件
   - 即時數據

## 專案結構

```
src/
├── app/                      # Next.js App Router
│   ├── (routes)/            # 路由頁面
│   │   ├── blog/           # 文章路由
│   │   ├── category/       # 分類路由
│   │   └── search/         # 搜尋路由
│   ├── api/                # API 路由
│   ├── layout.tsx          # 根佈局
│   └── page.tsx            # 首頁
│
├── components/              # React 組件
│   ├── ui/                 # 基礎 UI 組件
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Modal/
│   ├── layout/             # 佈局組件
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Navigation/
│   └── features/           # 功能組件
│       ├── ArticleCard/
│       ├── SearchBar/
│       └── CategoryFilter/
│
├── lib/                     # 工具函數
│   ├── api/                # API 整合
│   │   ├── wordpress.ts
│   │   └── cache.ts
│   ├── utils/              # 通用工具
│   │   ├── format.ts
│   │   └── validation.ts
│   └── hooks/              # 自定義 Hooks
│       ├── useSearch.ts
│       └── usePagination.ts
│
├── styles/                  # 樣式文件
│   ├── globals.css         # 全域樣式
│   └── components/         # 組件樣式
│
└── types/                   # TypeScript 類型
    ├── wordpress.d.ts      # WordPress 類型
    └── app.d.ts            # 應用類型
```

## 數據流程

### 1. 文章獲取流程

```typescript
// 客戶端請求
Client Request → Next.js Route → WordPress API → Data Transform → Response

// 詳細流程
1. 用戶訪問 /blog/[slug]
2. Next.js 調用 generateStaticParams
3. 從 WordPress API 獲取文章數據
4. 轉換數據格式
5. 渲染 React 組件
6. 返回 HTML 給客戶端
```

### 2. 快取策略

```typescript
// ISR 快取配置
export const revalidate = 60; // 60 秒

// API 快取
const response = await fetch(url, {
  next: { revalidate: 3600 } // 1 小時
});
```

## SEO 架構

### 搜尋引擎優化策略

#### 1. Sitemap 生成
```typescript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://skincake.tw',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  // 動態路由處理
  additionalPaths: async (config) => {
    const posts = await fetchAllPosts();
    return posts.map(post => ({
      loc: `/blog/${post.slug}`,
      lastmod: post.modified,
      priority: 0.7
    }));
  }
}
```

#### 2. 結構化數據
- **Article Schema**: 文章頁面 JSON-LD
- **BreadcrumbList**: 麵包屑導航
- **Organization**: 網站資訊
- **WebSite**: 搜尋框架構

#### 3. 預渲染策略
```typescript
// 靜態生成 + ISR
export const revalidate = 3600; // 1 小時

// 預渲染熱門文章
export async function generateStaticParams() {
  const posts = await getTopPosts(20);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

#### 4. 效能優化
- **圖片優化**: Next.js Image 元件
- **字體優化**: display: swap
- **預連接**: preconnect/dns-prefetch
- **程式碼分割**: 動態載入

### 自動化部署流程

```yaml
# GitHub Actions 工作流程
name: Scheduled Rebuild
on:
  schedule:
    - cron: '0 0 * * *' # 每日午夜
  workflow_dispatch:

jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for new posts
        run: |
          # 檢查新文章邏輯
      - name: Trigger deployment
        if: ${{ env.HAS_NEW_POSTS == 'true' }}
        run: |
          # 觸發 Vercel 部署
```

## 安全考量

### 1. API 安全
- 使用環境變數存儲敏感信息
- API 請求驗證
- Rate limiting

### 2. XSS 防護
- React 自動轉義
- DOMPurify 清理 HTML
- Content Security Policy

### 3. 性能安全
- 圖片優化和懶加載
- 代碼分割
- 資源壓縮

## 擴展性設計

### 水平擴展
- 無狀態應用設計
- CDN 分發靜態資源
- 容器化部署

### 垂直擴展
- 優化數據庫查詢
- 快取層優化
- 服務器資源升級

## 監控與維護

### 性能監控
- Core Web Vitals
- API 響應時間
- 錯誤率追蹤

### 日誌系統
- 應用日誌
- 錯誤日誌
- 訪問日誌

### 備份策略
- 代碼版本控制
- 數據庫備份
- 靜態資源備份

---

詳細的技術實現請參考[技術棧說明](./tech-stack.md)和[API 參考](./api-reference.md)。 