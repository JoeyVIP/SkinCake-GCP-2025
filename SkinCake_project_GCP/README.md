# SkinCake GCP 版本 - 2025

[![Version](https://img.shields.io/badge/version-2.1.0--gcp-blue.svg)](https://github.com/your-username/skincake-gcp)
[![Platform](https://img.shields.io/badge/platform-Google%20Cloud%20Platform-4285F4.svg)](https://cloud.google.com/)
[![Framework](https://img.shields.io/badge/framework-Next.js%2014-000000.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> 現代化的韓國美容旅遊資訊平台，基於 Google Cloud Platform 構建，提供高性能、可擴展的用戶體驗。

## 🌟 專案特色

### 🏗️ 現代化架構
- **Next.js 14** - 穩定的 React 框架，支援 SSG/ISR
- **Google Cloud Run** - 容器化部署，自動擴展
- **Cloud SQL** - 高可用性 MySQL 資料庫
- **Cloud CDN** - 全球內容分發網路
- **Cloud Storage** - 可擴展的檔案儲存

### 🤖 AI 功能整合
- **V1 核心體驗** - 專注於提供極致的性能和流暢的核心用戶旅程。
- **V2 AI 賦能** - 計劃在未來版本中整合 Cloud AI Platform, Cloud Search 等服務。

### 🚀 性能優化
- **Edge Caching** - 透過 Cloudflare 在全球邊緣節點進行快取。
- **Image Optimization** - 自動 WebP 轉換
- **Smart Caching** - 多層快取策略
- **CDN Acceleration** - 全球加速網路

### 📊 監控與分析
- **Cloud Monitoring** - 即時系統監控
- **Error Reporting** - 自動錯誤追蹤
- **Cloud Logging** - 結構化日誌記錄
- **Google Analytics 4** - 深度用戶分析

## 🛠️ 技術棧

### 前端技術
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State Management**: Zustand
- **UI Components**: 自定義設計系統

### 後端服務
- **Runtime**: Node.js 18 LTS
- **Database**: Cloud SQL (MySQL 8.0)
- **Cache**: Cloud Memorystore (Redis)
- **Storage**: Cloud Storage
- **API**: WordPress REST API

### 部署與運維
- **Container**: Docker
- **Deployment**: Cloud Run
- **CI/CD**: Cloud Build
- **Monitoring**: Cloud Operations Suite
- **Security**: Cloud IAM + Cloud Armor

## 📋 系統要求

### 開發環境
- Node.js 18.x LTS
- Docker 20.x+
- Google Cloud SDK
- Git

### GCP 服務
- Google Cloud Project（已啟用計費）
- Cloud Run API
- Cloud SQL API
- Cloud Storage API
- Cloud CDN API
- Cloud Build API

## 🚀 快速開始

### 1. 環境設置
```bash
# 克隆專案
git clone https://github.com/your-username/skincake-gcp.git
cd skincake-gcp

# 安裝依賴
npm install

# 設置 Google Cloud SDK
gcloud auth login
gcloud config set project your-project-id
```

### 2. 本地開發
```bash
# 啟動開發服務器
npm run dev

# 在瀏覽器中打開
open http://localhost:3000
```

### 3. 部署到 GCP
```bash
# 使用 Cloud Build 部署
gcloud builds submit --config cloudbuild.yaml .

# 或使用 gcloud 直接部署
gcloud run deploy skincake-app --source . --region asia-east1
```

## 📁 專案結構

```
skincake-gcp/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # 首頁
│   │   ├── blog/            # 文章頁面
│   │   ├── category/        # 分類頁面
│   │   ├── search/          # 搜尋頁面
│   │   └── api/             # API 路由
│   ├── components/          # React 組件
│   │   ├── ui/              # 基礎 UI 組件
│   │   ├── layout/          # 佈局組件
│   │   └── features/        # 功能組件
│   ├── lib/                 # 工具函數
│   │   ├── wordpress-api.ts # WordPress API 整合
│   │   ├── gcp-services.ts  # GCP 服務整合
│   │   └── utils.ts         # 通用工具
│   └── styles/              # 樣式檔案
├── public/                  # 靜態資源
├── docs/                    # 文檔
├── docker/                  # Docker 配置
├── .env.example             # 環境變數範例
├── cloudbuild.yaml          # Cloud Build 配置
├── Dockerfile               # Docker 配置
└── next.config.js           # Next.js 配置
```

## 🎯 核心功能 (V1 - 2025 交付重點)

### 首頁功能
- **精選推薦** - 基於熱門度的手動精選內容。
- **蛋糕報報** - 按時間排序的最新文章。
- **地區探索** - 清晰的地理分類導航。
- **肌膚地圖** - 視覺化的地點展示。
- **基礎搜尋** - 支援文章標題搜尋。

### 文章系統
- **SSG/ISR 渲染** - 為 SEO 和速度優化的靜態與增量生成。
- **富文本支援** - 完整的內容展示
- **社交分享** - 多平台分享功能
- **相關文章推薦** - 基於標籤或分類的推薦。
- **評論系統** - (V2 功能)

### 分類系統
- **熱門關鍵字** - 幫助用戶發現熱門內容。
- **互動式標籤雲** - 點擊標籤即可篩選文章。
- **多重篩選** - 複合條件篩選
- **個性化排序** - 基於用戶行為

### 店家系統
- **地圖整合** - Google Maps API
- **服務展示** - 多媒體內容展示
- **評價系統** - (初期為靜態展示)
- **預約系統** - (V2 功能)

## 🔧 配置指南

### 環境變數
```bash
# 複製環境變數範例
cp .env.example .env.local

# 配置必要的環境變數
NODE_ENV=development
DATABASE_URL=mysql://user:password@host:port/database
REDIS_URL=redis://host:port
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
GOOGLE_MAPS_API_KEY=your_api_key
GOOGLE_ANALYTICS_ID=your_ga_id
```

### GCP 配置
```bash
# 設置 GCP 專案
gcloud config set project your-project-id
gcloud config set compute/region asia-east1

# 啟用必要的 API
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
```

## 📊 監控與分析

### 性能指標
- **Lighthouse 分數**: > 95
- **首次內容繪製**: < 1.2s
- **完全載入時間**: < 2.5s
- **Core Web Vitals**: 全綠

### 監控工具
- **Cloud Monitoring** - 系統指標監控
- **Error Reporting** - 錯誤自動追蹤
- **Cloud Trace** - 性能追蹤
- **Cloud Logging** - 結構化日誌

### 分析功能
- **Google Analytics 4** - 用戶行為分析
- **Google Tag Manager** - 標籤管理
- **Custom Metrics** - 自定義指標
- **A/B Testing** - 功能測試

## 🛡️ 安全性

### 資料保護
- **Cloud IAM** - 身份與存取管理
- **Secret Manager** - 機密資料管理
- **Cloud Armor** - DDoS 防護
- **SSL/TLS** - 加密傳輸

### 最佳實踐
- 最小權限原則
- 定期安全掃描
- 依賴套件更新
- 安全漏洞監控

## 💰 成本優化

### 預估成本（月）
- **Cloud Run**: $50-200
- **Cloud SQL**: $100-300
- **Cloud Storage**: $20-50
- **Cloud CDN**: $30-100
- **其他服務**: $50-100
- **總計**: $250-750

### 優化策略
- 自動擴展配置
- 智能快取策略
- 生命週期管理
- 資源監控警報

## 📚 文檔

- [開發計劃](development-plan-gcp-2024.md)
- [功能規格](valuable-features-gcp.md)
- [版本管理](versioning-gcp.md)
- [部署指南](deployment-guide-gcp.md)

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📝 更新日誌

### v2.1.0-gcp (2025-07-16)
- 🎉 **2025 核心聚焦版**
- 🏗️ 重新定義 V1 開發範圍，專注於四大核心頁面
- 🤖 將進階 AI 功能（推薦、搜尋）移至 V2 階段
- 🚀 強化 SSG/ISR 渲染策略以優化 SEO

### v2.0.0-gcp (2025-07-15)
- 初始 GCP 版本發布
- 完整的 Cloud 服務整合

## �� 支援

如果您遇到問題或有任何建議，請：

1. 查看 [常見問題](docs/faq.md)
2. 搜尋現有的 [Issues](https://github.com/your-username/skincake-gcp/issues)
3. 創建新的 [Issue](https://github.com/your-username/skincake-gcp/issues/new)
4. 聯繫開發團隊

## 📄 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

---

**SkinCake GCP 版本** - 由 ❤️ 和 ☁️ 打造的現代化美容旅遊平台 