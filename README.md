# SkinCake V2.0.0 - 全新韓國美容旅遊平台

![SkinCake Logo](https://img.shields.io/badge/SkinCake-V2.0.0-pink?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

> 🎉 **全新重構版本** - 基於 Next.js 14 的現代化韓國美容旅遊資訊平台

## ✨ V2.0.0 重點特色

### 🚀 技術架構全面升級
- **Next.js 14 + App Router** - 最新的 React 框架
- **TypeScript** - 完整的類型安全
- **Tailwind CSS 3** - 現代化 CSS 框架
- **WordPress API 深度整合** - 動態內容管理
- **SSG + ISR 混合渲染** - 最佳性能和 SEO

### 🎨 全新用戶界面
- **響應式設計** - 完美支援桌面和手機版
- **現代化視覺風格** - 清新的韓系美學
- **直觀的導航系統** - 流暢的用戶體驗
- **高品質圖片優化** - 快速載入和顯示

### 📱 核心功能
- **智能文章系統** - 動態載入 WordPress 內容
- **進階分類篩選** - 多維度排序和分頁
- **全文搜尋功能** - 快速內容發現
- **社交分享整合** - 便捷的內容分享
- **標籤雲導航** - 智能內容推薦

## 🛠️ 技術棧

### 前端框架
- **Next.js 14.2.30** - React 全端框架
- **React 18.3.1** - 用戶界面庫
- **TypeScript 5** - 靜態類型檢查

### 樣式與 UI
- **Tailwind CSS 3.4.16** - 實用優先的 CSS 框架
- **PostCSS** - CSS 後處理器
- **clsx & tailwind-merge** - 動態樣式組合

### 數據與 API
- **WordPress REST API** - 內容管理系統
- **Next.js API Routes** - 服務端 API
- **SWR** - 數據獲取和快取

### 部署與雲端
- **Google Cloud Platform** - 雲端平台
- **Cloud Run** - 容器化部署
- **Cloud Build** - 自動化構建
- **Docker** - 容器化技術

## 📦 安裝與開發

### 環境要求
- Node.js 14 或更高版本
- npm 或 yarn 包管理器
- Git 版本控制

### 快速開始

```bash
# 克隆專案
git clone https://github.com/JoeyVIP/SkinCake-GCP-2025.git
cd SkinCake-GCP-2025

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 開啟瀏覽器訪問
# http://localhost:3000
```

### 環境配置

```bash
# 複製環境變數模板
cp .env.example .env.local

# 編輯環境變數
vim .env.local
```

```env
# WordPress API 配置
WORDPRESS_API_URL=https://skincake.online/wp-json/wp/v2

# Next.js 配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🏗️ 專案結構

```
SkinCake-GCP-2025/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── blog/[slug]/       # 文章頁面
│   │   ├── category/[id]/     # 分類頁面
│   │   ├── search/            # 搜尋頁面
│   │   ├── layout.tsx         # 根佈局
│   │   └── page.tsx           # 首頁
│   ├── components/            # React 組件
│   │   ├── ui/               # 基礎 UI 組件
│   │   ├── layout/           # 佈局組件
│   │   └── features/         # 功能組件
│   ├── lib/                  # 工具函數
│   │   ├── wordpress-api.ts  # WordPress API
│   │   └── utils.ts          # 通用工具
│   └── styles/               # 全域樣式
├── public/                   # 靜態資源
│   └── images/              # 圖片資源
├── docs/                    # 專案文檔
├── Dockerfile              # Docker 配置
├── cloudbuild.yaml        # Cloud Build 配置
└── package.json           # 專案配置
```

## 🚀 部署指南

### 本地構建

```bash
# 構建生產版本
npm run build

# 預覽生產版本
npm start
```

### GCP 部署

```bash
# 使用 gcloud CLI 部署
gcloud builds submit --config cloudbuild.yaml

# 或使用 Docker 部署
docker build -t skincake-v2 .
docker run -p 3000:3000 skincake-v2
```

### 自動化部署

專案配置了 GitHub Actions，當推送到 `main` 分支時自動觸發部署到 GCP。

## 🔧 開發指南

### 新增頁面

```bash
# 在 src/app/ 目錄下創建新頁面
mkdir src/app/new-page
touch src/app/new-page/page.tsx
```

### 新增組件

```bash
# 在 src/components/ 目錄下創建組件
touch src/components/NewComponent.tsx
```

### API 整合

```typescript
// 使用 WordPress API
import { getRecentPosts } from '@/lib/wordpress-api';

const posts = await getRecentPosts(6);
```

## 📊 性能優化

- **圖片優化** - Next.js Image 組件自動優化
- **代碼分割** - 自動按路由分割代碼
- **快取策略** - ISR 和 SWR 快取
- **SEO 優化** - 動態元數據生成

## 🎯 V2.0.0 新功能

### ✅ 已實現功能
- [x] 現代化首頁設計
- [x] 動態文章系統
- [x] 進階分類頁面
- [x] 全文搜尋功能
- [x] 響應式設計
- [x] WordPress API 整合
- [x] SEO 優化
- [x] 社交分享
- [x] 標籤雲導航
- [x] 圖片優化

### 🚧 計劃中功能
- [ ] 用戶評論系統
- [ ] 多語言支援
- [ ] PWA 功能
- [ ] 離線支援
- [ ] 推送通知

## 🐛 故障排除

### 常見問題

**Q: 開發伺服器無法啟動**
```bash
# 清除 Next.js 快取
rm -rf .next
npm run dev
```

**Q: 圖片無法載入**
```bash
# 檢查圖片路徑和 Next.js 配置
# 確保圖片在 public/ 目錄下
```

**Q: WordPress API 連接失敗**
```bash
# 檢查環境變數配置
# 確認 WordPress 網站可訪問
```

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 版本歷史

### V2.0.0 (2025-01-XX)
- 🎉 **全新架構** - 基於 Next.js 14 完全重構
- ✨ **現代化設計** - 全新的視覺界面
- 🚀 **性能優化** - SSG + ISR 混合渲染
- 📱 **響應式支援** - 完美的移動端體驗

## 📞 聯絡資訊

- **網站**: [https://skincake.online](https://skincake.online)
- **GitHub**: [https://github.com/JoeyVIP/SkinCake-GCP-2025](https://github.com/JoeyVIP/SkinCake-GCP-2025)
- **作者**: Joey Liao

## 📄 授權條款

此專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

---

<div align="center">
  <b>用 ❤️ 和 ☕ 在台灣製作</b>
</div>