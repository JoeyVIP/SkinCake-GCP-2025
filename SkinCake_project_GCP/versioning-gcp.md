# 版本管理規範 - GCP 版本 2025

## 當前版本
- 版本號：2.1.0-gcp
- 更新日期：2025-07-16
- 更新內容：發布 2025 核心聚焦版，重新定義 V1 開發範圍，專注於四大核心頁面，並將進階 AI 功能移至 V2 階段。

## 版本號格式
版本號格式為：主版本號.次版本號.修訂號-平台（MAJOR.MINOR.PATCH-PLATFORM）
- 主版本號：重大功能更新或架構變更時增加
- 次版本號：新功能添加時增加
- 修訂號：問題修復或小改進時增加
- 平台標識：gcp（Google Cloud Platform）

## GCP 版本特色

### 2.1.0-gcp (2025 核心聚焦版)
- **開發範圍聚焦**: 專注於四大核心頁面（首頁、文章、分類、店家）的卓越體驗。
- **務實的 V1 實現**: 採用基於規則的推薦和基礎搜尋，確保快速交付。
- **強化 SEO 基礎**: 嚴格執行 SSG/ISR 渲染策略。
- **未來可擴展性**: 為 V2 整合進階 AI 功能預留了清晰的升級路徑。

### 2.0.0-gcp (2025 初始版本)
- **架構重構**：
  - 從 Cloudflare Workers 遷移到 Google Cloud Platform
  - 使用 Cloud Run 進行容器化部署
  - 整合 Cloud SQL、Cloud Storage、Cloud CDN
  - 實現 Cloud Build 自動化 CI/CD 流程

- **AI 功能整合**：
  - 整合 Cloud AI Platform 進行個性化推薦
  - 使用 Cloud Search API 提升搜尋體驗
  - 實現 Cloud Translation API 多語言支援
  - 整合 Cloud Vision API 進行圖片分析

- **性能優化**：
  - 全球 CDN 加速（Cloud CDN）
  - 智能快取策略（Cloud Memorystore）
  - 自動圖片優化（Cloud Storage）
  - 邊緣計算優化

- **監控與分析**：
  - Cloud Monitoring 系統監控
  - Error Reporting 錯誤追蹤
  - Cloud Logging 應用日誌
  - Google Analytics 4 深度整合

## 版本歷史

### GCP 版本線
- 2.1.0-gcp (2025-07-16)
  - 發布 2025 核心聚焦版
  - 簡化 AI 功能，專注核心體驗
- 2.0.0-gcp (2025-07-15)
  - 初始 GCP 版本發布
  - 完整的 Cloud 服務整合
  - AI 功能實現
  - 現代化部署流程

### 原版本線（參考）
- 1.5.0 (2024-05-19)
  - 完成 SPA 架構中新分類頁的整合
  - 文章頁面功能修復與體驗優化
  - 新增品牌示範頁面

## GCP 環境配置

### 開發環境
```bash
# 1. 安裝 Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# 2. 設置專案
gcloud config set project skincake-gcp-project
gcloud config set compute/region asia-east1

# 3. 安裝依賴
npm install

# 4. 啟動開發服務器
npm run dev
```

### 生產環境
```bash
# 1. 構建 Docker 映像
docker build -t gcr.io/skincake-gcp-project/skincake-app:latest .

# 2. 推送到 Container Registry
docker push gcr.io/skincake-gcp-project/skincake-app:latest

# 3. 部署到 Cloud Run
gcloud run deploy skincake-app \
  --image gcr.io/skincake-gcp-project/skincake-app:latest \
  --region asia-east1 \
  --platform managed
```

## 環境要求

### 開發環境
- Node.js 版本：18.x LTS
- Docker 版本：20.x+
- Google Cloud SDK：最新版本
- 包管理器：npm 或 yarn

### GCP 服務需求
- Google Cloud Project（啟用計費）
- Cloud Run API
- Cloud SQL API
- Cloud Storage API
- Cloud CDN API
- Cloud Build API
- Cloud Monitoring API
- Cloud Logging API

## 環境配置文件

### 開發環境
```json
// package.json
{
  "name": "skincake-gcp",
  "version": "2.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "docker:build": "docker build -t skincake-app .",
    "docker:run": "docker run -p 3000:3000 skincake-app",
    "gcp:deploy": "gcloud run deploy skincake-app --source .",
    "gcp:logs": "gcloud run logs tail skincake-app"
  }
}
```

### Docker 配置
```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Build 配置
```yaml
# cloudbuild.yaml
steps:
  # 構建 Docker 映像
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/skincake-app:$COMMIT_SHA', '.']
  
  # 推送到 Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/skincake-app:$COMMIT_SHA']
  
  # 部署到 Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'skincake-app',
      '--image', 'gcr.io/$PROJECT_ID/skincake-app:$COMMIT_SHA',
      '--region', 'asia-east1',
      '--platform', 'managed',
      '--allow-unauthenticated'
    ]

# 觸發條件
trigger:
  branch: '^main$'
```

## 版本升級流程

### 1. 版本號更新
```bash
# 更新 package.json
npm version patch  # 修訂號 +1
npm version minor  # 次版本號 +1
npm version major  # 主版本號 +1

# 更新相關文件
- package.json
- README.md
- versioning-gcp.md
- cloudbuild.yaml
```

### 2. 代碼提交
```bash
# 添加更改
git add .
git commit -m "release: 版本 2.0.x-gcp 發布

- 新功能1
- 新功能2
- 修復問題1"

# 創建標籤
git tag -a v2.0.x-gcp -m "版本 2.0.x-gcp"

# 推送到 GitHub
git push origin main
git push origin v2.0.x-gcp
```

### 3. 自動部署
```bash
# Cloud Build 會自動觸發
# 1. 檢測到 main 分支變更
# 2. 執行 cloudbuild.yaml
# 3. 構建 Docker 映像
# 4. 部署到 Cloud Run
# 5. 更新 Cloud CDN 快取
```

### 4. 部署後檢查
```bash
# 檢查服務狀態
gcloud run services describe skincake-app --region=asia-east1

# 查看日誌
gcloud run logs tail skincake-app --region=asia-east1

# 檢查監控指標
gcloud monitoring metrics list --filter="resource.type=cloud_run_revision"

# 測試網站功能
curl -I https://skincake-app-xxx-as.a.run.app
```

## 回滾策略

### 1. 快速回滾
```bash
# 回滾到上一個版本
gcloud run services update skincake-app \
  --image gcr.io/skincake-gcp-project/skincake-app:PREVIOUS_SHA \
  --region asia-east1
```

### 2. 流量分割
```bash
# 將流量分割到不同版本
gcloud run services update-traffic skincake-app \
  --to-revisions=REVISION_1=50,REVISION_2=50 \
  --region asia-east1
```

### 3. 完全回滾
```bash
# 回滾到特定版本
git checkout v2.0.x-gcp
gcloud run deploy skincake-app \
  --source . \
  --region asia-east1
```

## 監控與維護

### 1. 效能監控
```bash
# 查看 Cloud Run 指標
gcloud run services describe skincake-app --region=asia-east1

# 監控 CPU 和記憶體使用
gcloud monitoring metrics list --filter="resource.type=cloud_run_revision"

# 查看請求延遲
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

### 2. 錯誤追蹤
```bash
# 查看錯誤日誌
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit=50

# 查看 Error Reporting
gcloud error-reporting events list --service=skincake-app
```

### 3. 成本監控
```bash
# 查看計費資訊
gcloud billing accounts list
gcloud billing projects describe skincake-gcp-project

# 設置預算警報
gcloud alpha billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="SkinCake Budget" \
  --budget-amount=500USD
```

## 安全性更新

### 1. 依賴更新
```bash
# 檢查安全漏洞
npm audit

# 修復安全問題
npm audit fix

# 更新依賴
npm update
```

### 2. 容器安全
```bash
# 掃描容器漏洞
gcloud container images scan gcr.io/skincake-gcp-project/skincake-app:latest

# 查看掃描結果
gcloud container images list-tags gcr.io/skincake-gcp-project/skincake-app \
  --show-occurrences
```

### 3. 權限管理
```bash
# 查看 IAM 權限
gcloud projects get-iam-policy skincake-gcp-project

# 更新服務帳戶權限
gcloud projects add-iam-policy-binding skincake-gcp-project \
  --member="serviceAccount:skincake-app@skincake-gcp-project.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

## 災難恢復

### 1. 資料備份
```bash
# Cloud SQL 自動備份
gcloud sql backups list --instance=skincake-db

# 手動備份
gcloud sql backups create --instance=skincake-db
```

### 2. 服務恢復
```bash
# 多區域部署
gcloud run deploy skincake-app \
  --image gcr.io/skincake-gcp-project/skincake-app:latest \
  --region asia-southeast1 \
  --platform managed
```

### 3. 資料恢復
```bash
# 從備份恢復
gcloud sql backups restore BACKUP_ID \
  --restore-instance=skincake-db-restore \
  --backup-instance=skincake-db
```

## 注意事項

### 1. 版本管理
- 每次更新都要更新版本號
- 保持版本說明的清晰性
- 確保所有環境配置同步

### 2. 部署流程
- 先在開發環境測試
- 使用 Cloud Build 自動化部署
- 監控部署後的系統狀態

### 3. 成本控制
- 定期檢查資源使用情況
- 設置預算警報
- 優化不必要的服務

### 4. 安全性
- 定期更新依賴套件
- 監控安全漏洞
- 遵循最小權限原則

## 結語

這個 GCP 版本的版本管理規範旨在確保 SkinCake 專案在 Google Cloud Platform 上的穩定運行和持續發展。通過完善的版本控制、自動化部署和監控機制，我們能夠快速響應變化並維護高質量的服務。 