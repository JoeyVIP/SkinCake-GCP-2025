# 部署指南

本指南涵蓋 SkinCake 專案在各種平台的部署方式。

## 部署平台

### 支援的平台
- **Google Cloud Platform (GCP)** - 主要部署平台
- **Vercel** - 備用部署平台
- **Cloudflare Pages** - 靜態站點部署

## Google Cloud Platform 部署

### 前置需求
- GCP 帳號和專案
- 安裝 gcloud CLI
- Docker（用於容器化）

### 部署步驟

#### 1. 設置 GCP 專案

```bash
# 設置專案 ID
export PROJECT_ID=your-project-id

# 設置預設專案
gcloud config set project $PROJECT_ID

# 啟用必要的 API
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

#### 2. 配置 Cloud Build

確保 `cloudbuild.yaml` 存在且配置正確：

```yaml
steps:
  # 構建 Docker 映像
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/skincake:$COMMIT_SHA', '.']
  
  # 推送到 Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/skincake:$COMMIT_SHA']
  
  # 部署到 Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'skincake'
      - '--image'
      - 'gcr.io/$PROJECT_ID/skincake:$COMMIT_SHA'
      - '--region'
      - 'asia-east1'
      - '--platform'
      - 'managed'
```

#### 3. 執行部署

```bash
# 手動部署
gcloud builds submit --config cloudbuild.yaml

# 或使用 npm 腳本
npm run deploy:gcp
```

### 環境變數設置

在 Cloud Run 中設置環境變數：

```bash
gcloud run services update skincake \
  --update-env-vars WORDPRESS_API_URL=https://skincake.online/wp-json/wp/v2 \
  --update-env-vars NEXT_PUBLIC_SITE_URL=https://skincake.tw
```

## Vercel 部署

### 使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel

# 部署到生產環境
vercel --prod
```

### 使用 GitHub 整合

1. 連接 GitHub 儲存庫到 Vercel
2. 設置環境變數
3. 每次推送到 main 分支自動部署

### Vercel 配置

創建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "WORDPRESS_API_URL": "@wordpress_api_url"
  }
}
```

## Cloudflare Pages 部署

### 靜態導出部署

```bash
# 構建靜態站點
npm run build:static

# 輸出目錄: out/
```

### Cloudflare Pages 設置

1. 在 Cloudflare Dashboard 創建新專案
2. 連接 GitHub 儲存庫
3. 配置構建設置：
   - **構建命令**: `npm run build:static`
   - **構建輸出目錄**: `out`
   - **環境變數**: 設置必要的環境變數

## 生產環境配置

### 1. 域名設置

```bash
# GCP Cloud Run 自定義域名
gcloud run domain-mappings create \
  --service skincake \
  --domain skincake.tw \
  --region asia-east1
```

### 2. SSL 證書

- GCP: 自動管理 SSL
- Vercel: 自動配置 Let's Encrypt
- Cloudflare: 使用 Cloudflare SSL

### 3. 性能優化

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['skincake.online'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
}
```

## 持續部署 (CI/CD)

### GitHub Actions 配置

創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GCP
        env:
          GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}
        run: |
          echo $GCP_SA_KEY | gcloud auth activate-service-account --key-file=-
          gcloud builds submit --config cloudbuild.yaml
```

## 監控與日誌

### Cloud Run 監控

```bash
# 查看日誌
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=skincake" --limit 50

# 查看指標
gcloud monitoring dashboards list
```

### 健康檢查

配置健康檢查端點：

```javascript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy' });
}
```

## 部署檢查清單

### 部署前
- [ ] 執行測試 `npm test`
- [ ] 構建檢查 `npm run build`
- [ ] 環境變數確認
- [ ] 版本號更新

### 部署後
- [ ] 網站可訪問性
- [ ] API 連接正常
- [ ] 圖片載入正常
- [ ] SEO meta 標籤
- [ ] 性能指標監控

## 回滾策略

### GCP Cloud Run

```bash
# 列出版本
gcloud run revisions list --service skincake

# 回滾到特定版本
gcloud run services update-traffic skincake \
  --to-revisions=skincake-00002-abc=100
```

### Vercel

使用 Vercel Dashboard 的 "Instant Rollback" 功能

## 故障排除

### 常見問題

1. **構建失敗**
   - 檢查 Node.js 版本
   - 確認環境變數
   - 查看構建日誌

2. **部署失敗**
   - 檢查權限設置
   - 確認配額限制
   - 驗證 Docker 映像

3. **運行時錯誤**
   - 查看應用日誌
   - 檢查 API 連接
   - 驗證環境配置

---

需要協助？請查看[故障排除指南](../maintenance/troubleshooting.md)或聯繫技術支援。 