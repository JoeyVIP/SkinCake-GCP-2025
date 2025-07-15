# SkinCake GCP + Cloudflare 部署指南 (2025版)

## 概述

本指南將引導您完成 SkinCake 專案在 Google Cloud Platform 上的後端部署，並結合 Cloudflare 作為 CDN 和安全層，實現 2025 年 V1 版本所需的最佳性能與安全性。

## 前置準備

### 1. 環境要求
- Google Cloud Platform 帳戶（已啟用計費）
- Cloudflare 帳戶（您的網域已在此管理）
- Google Cloud SDK 安裝並配置
- Docker 安裝
- Node.js 18.x LTS
- Git 版本控制

### 2. 必要權限
確保您的 GCP 帳戶具有以下權限：
- Project Owner 或 Editor
- Cloud Run Admin
- Cloud SQL Admin
- Cloud Storage Admin
- Cloud Build Admin
- IAM Admin

## 第一階段：GCP 專案設置

### 1. 建立 GCP 專案
```bash
# 建立新專案
gcloud projects create skincake-gcp-project --name="SkinCake GCP"

# 設置為預設專案
gcloud config set project skincake-gcp-project

# 啟用計費（需要計費帳戶 ID）
gcloud billing projects link skincake-gcp-project --billing-account=BILLING_ACCOUNT_ID
```

### 2. 啟用必要的 API
```bash
# 啟用所有必要的 API
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  container.googleapis.com \
  cloudresourcemanager.googleapis.com \
  compute.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  errorreporting.googleapis.com \
  cloudtrace.googleapis.com \
  secretmanager.googleapis.com
```

### 3. 設置預設區域
```bash
# 設置預設區域為亞洲東部
gcloud config set compute/region asia-east1
gcloud config set compute/zone asia-east1-a
```

## 第二階段：資料庫設置

### 1. 建立 Cloud SQL 實例
```bash
# 建立 MySQL 8.0 實例
gcloud sql instances create skincake-db \
  --database-version=MYSQL_8_0 \
  --tier=db-standard-2 \
  --region=asia-east1 \
  --storage-size=100GB \
  --storage-type=SSD \
  --storage-auto-increase \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=04 \
  --maintenance-release-channel=production
```

### 2. 建立資料庫和使用者
```bash
# 建立資料庫
gcloud sql databases create skincake_db --instance=skincake-db

# 建立使用者（請替換為安全密碼）
gcloud sql users create skincake_user \
  --instance=skincake-db \
  --password=YOUR_SECURE_PASSWORD

# 授權 Cloud Run 連接 (重要步驟)
gcloud projects add-iam-policy-binding skincake-gcp-project \
    --member="serviceAccount:$(gcloud projects describe skincake-gcp-project --format='value(projectNumber)')-compute@developer.gserviceaccount.com" \
    --role="roles/cloudsql.client"
```

### 3. 設置 SSL 連接
```bash
# 下載 SSL 憑證
gcloud sql ssl-certs create skincake-client-cert \
  --instance=skincake-db

# 下載憑證檔案
gcloud sql ssl-certs describe skincake-client-cert \
  --instance=skincake-db \
  --format="get(cert)" > client-cert.pem

gcloud sql instances describe skincake-db \
  --format="get(serverCaCert.cert)" > server-ca.pem
```

## 第三階段：檔案儲存設置

### 1. 建立 Cloud Storage 儲存桶
```bash
# 建立靜態資源儲存桶
gsutil mb -p skincake-gcp-project -c STANDARD -l asia-east1 gs://skincake-static-assets

# 建立媒體檔案儲存桶
gsutil mb -p skincake-gcp-project -c STANDARD -l asia-east1 gs://skincake-media-uploads

# 建立備份儲存桶
gsutil mb -p skincake-gcp-project -c NEARLINE -l asia-east1 gs://skincake-backups
```

### 2. 設置 CORS 政策
```bash
# 建立 CORS 配置檔案
cat > cors.json << EOF
[
  {
    "origin": ["https://skincake-app-xxx-as.a.run.app", "https://skincake.tw"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
EOF

# 應用 CORS 設置
gsutil cors set cors.json gs://skincake-static-assets
gsutil cors set cors.json gs://skincake-media-uploads
```

### 3. 設置生命週期管理
```bash
# 建立生命週期配置
cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
EOF

# 應用生命週期規則
gsutil lifecycle set lifecycle.json gs://skincake-static-assets
```

## 第四階段：快取設置

### 1. 建立 Memorystore Redis 實例
```bash
# 建立 Redis 實例
gcloud redis instances create skincake-cache \
  --size=1 \
  --region=asia-east1 \
  --redis-version=redis_6_x \
  --tier=standard \
  --transit-encryption-mode=SERVER_AUTHENTICATION
```

### 2. 獲取 Redis 連接資訊
```bash
# 獲取 Redis 主機和埠
gcloud redis instances describe skincake-cache \
  --region=asia-east1 \
  --format="get(host,port)"
```

## 第五階段：Secret Manager 設置

### 1. 建立機密資料
```bash
# 建立資料庫連接字串
echo "mysql://skincake_user:YOUR_SECURE_PASSWORD@/skincake_db?host=/cloudsql/skincake-gcp-project:asia-east1:skincake-db" | \
gcloud secrets create db-connection-string --data-file=-

# 建立 Redis 連接字串
echo "redis://REDIS_HOST:6379" | \
gcloud secrets create redis-connection-string --data-file=-

# 建立 API 金鑰
cat > api-keys.json << EOF
{
  "wordpress_api_url": "https://skincake.online/wp-json/wp/v2",
  "google_maps_api_key": "YOUR_GOOGLE_MAPS_API_KEY",
  "google_analytics_id": "YOUR_GA4_ID"
}
EOF

gcloud secrets create api-keys --data-file=api-keys.json
```

### 2. 設置 IAM 權限
```bash
# 為 Cloud Run 服務帳戶授予 Secret Manager 存取權限
gcloud projects add-iam-policy-binding skincake-gcp-project \
  --member="serviceAccount:skincake-app@skincake-gcp-project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 第六階段：應用程式部署

### 1. 準備應用程式代碼
```bash
# 克隆專案
git clone https://github.com/your-username/skincake-gcp.git
cd skincake-gcp

# 安裝依賴
npm install

# 建立環境配置檔案
cat > .env.production << EOF
NODE_ENV=production
DATABASE_URL=mysql://skincake_user:YOUR_SECURE_PASSWORD@/skincake_db?host=/cloudsql/skincake-gcp-project:asia-east1:skincake-db
REDIS_URL=redis://REDIS_HOST:6379
WORDPRESS_API_URL=https://skincake.online/wp-json/wp/v2
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
GOOGLE_ANALYTICS_ID=YOUR_GA4_ID
EOF
```

### 2. 建立 Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安裝依賴
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# 建構應用程式
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生產環境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 3. 建立 Cloud Build 配置
```yaml
# cloudbuild.yaml
steps:
  # 建構 Docker 映像
  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'build',
      '-t', 'gcr.io/$PROJECT_ID/skincake-app:$COMMIT_SHA',
      '-t', 'gcr.io/$PROJECT_ID/skincake-app:latest',
      '.'
    ]

  # 推送映像到 Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/skincake-app:$COMMIT_SHA']

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/skincake-app:latest']

  # 部署到 Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'skincake-app',
      '--image', 'gcr.io/$PROJECT_ID/skincake-app:$COMMIT_SHA',
      '--region', 'asia-east1',
      '--platform', 'managed',
      '--no-allow-unauthenticated', # <--- 重要：改為不允許公開訪問
      '--ingress', 'internal-and-cloud-load-balancing', # <--- 重要：限制入口
      '--memory', '2Gi',
      '--cpu', '1',
      '--min-instances', '1',
      '--max-instances', '100',
      '--set-cloudsql-instances', 'skincake-gcp-project:asia-east1:skincake-db',
      '--set-env-vars', 'NODE_ENV=production',
      '--set-secrets', 'DATABASE_URL=db-connection-string:latest,REDIS_URL=redis-connection-string:latest'
    ]

# 設置觸發器
trigger:
  branch: '^main$'

# 設置替代變數
substitutions:
  _SERVICE_NAME: skincake-app
  _REGION: asia-east1

# 設置超時
timeout: 1200s
```

### 4. 執行部署
```bash
# 使用 Cloud Build 部署
gcloud builds submit --config cloudbuild.yaml .

# 或直接使用 gcloud 部署
gcloud run deploy skincake-app \
  --source . \
  --region asia-east1 \
  --platform managed \
  --no-allow-unauthenticated \
  --ingress internal-and-cloud-load-balancing \
  --memory 2Gi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 100 \
  --set-cloudsql-instances skincake-gcp-project:asia-east1:skincake-db
```

## 第七階段：Cloudflare 整合

### 1. 獲取 Cloud Run URL
部署完成後，獲取您的 Cloud Run 服務 URL。它看起來像這樣： `https://skincake-app-xxxxxxxxxx-an.a.run.app`

### 2. 在 Cloudflare 中設置 DNS
1.  登入您的 Cloudflare 儀表板。
2.  選擇您的網域 (`skincake.tw`)。
3.  進入 **DNS** 設置頁面。
4.  創建一個 `CNAME` 記錄：
    - **類型**: `CNAME`
    - **名稱**: `www` (或其他子域名，或 `@` 代表根域名)
    - **目標**: 您的 Cloud Run 服務 URL (`skincake-app-xxxxxxxxxx-an.a.run.app`)
    - **Proxy 狀態**: **Proxied** (橘色雲朵)，這會啟用 Cloudflare 的 CDN 和安全功能。
    - **TTL**: Auto

### 3. 配置 SSL/TLS
1.  在 Cloudflare 儀表板中，進入 **SSL/TLS** 頁面。
2.  將加密模式設置為 **Full (Strict)**。這確保從瀏覽器到 Cloudflare，再到您的 GCP 後端的全程加密。

### 4. 建立 WAF 規則（推薦）
1.  進入 **Security** -> **WAF** 頁面。
2.  啟用 Cloudflare 的托管規則集，以防禦常見的網路攻擊 (如 SQL Injection, XSS)。

### 5. 建立 Page Rule 優化性能
1.  進入 **Rules** -> **Page Rules** 頁面。
2.  為您的網站創建規則，例如：
    - **URL**: `skincake.tw/assets/*`
    - **設置**: `Cache Level: Cache Everything`, `Edge Cache TTL: a month`
    - **URL**: `skincake.tw/blog/*`
    - **設置**: `Cache Level: Cache Everything`, `Browser Cache TTL: 4 hours`, `Edge Cache TTL: 1 day`

## 第八階段：監控設置

### 1. 設置 Cloud Monitoring
```bash
# 建立通知通道（電子郵件）
gcloud alpha monitoring channels create \
  --display-name="SkinCake Alerts" \
  --type=email \
  --channel-labels=email_address=your-email@example.com

# 建立警報政策
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring-policy.yaml
```

### 2. 建立監控政策檔案
```yaml
# monitoring-policy.yaml
displayName: "SkinCake High Error Rate"
conditions:
  - displayName: "Error rate too high"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" resource.label.service_name="skincake-app"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 0.05
      duration: 300s
      aggregations:
        - alignmentPeriod: 60s
          perSeriesAligner: ALIGN_RATE
          crossSeriesReducer: REDUCE_MEAN
notificationChannels:
  - projects/skincake-gcp-project/notificationChannels/NOTIFICATION_CHANNEL_ID
```

### 3. 設置 Cloud Logging
```bash
# 建立日誌接收器
gcloud logging sinks create skincake-error-sink \
  bigquery.googleapis.com/projects/skincake-gcp-project/datasets/skincake_logs \
  --log-filter='resource.type="cloud_run_revision" severity>=ERROR'
```

## 第九階段：安全性設置

### 1. 設置 Cloud Armor (可選，由 Cloudflare WAF 取代)
Cloudflare WAF 提供了強大的保護。如果您需要額外的應用層防護或與 GCP 其他服務的深度整合，可以考慮啟用 Cloud Armor。對於大多數情況，Cloudflare 的保護已足夠。

### 2. 設置 IAM 權限
```bash
# 建立自訂角色
gcloud iam roles create skincakeAppRole \
  --project skincake-gcp-project \
  --title "SkinCake App Role" \
  --description "Custom role for SkinCake application" \
  --permissions cloudsql.instances.connect,secretmanager.versions.access,storage.objects.get

# 為 Cloud Run 服務帳戶授予權限
gcloud projects add-iam-policy-binding skincake-gcp-project \
  --member="serviceAccount:skincake-app@skincake-gcp-project.iam.gserviceaccount.com" \
  --role="projects/skincake-gcp-project/roles/skincakeAppRole"
```

## 第十階段：域名設置

### 1. 設置自訂域名
```bash
# 將自訂域名映射到 Cloud Run 服務
gcloud run domain-mappings create \
  --service skincake-app \
  --domain skincake.tw \
  --region asia-east1
```

### 2. 設置 DNS 記錄
```bash
# 獲取 DNS 記錄資訊
gcloud run domain-mappings describe \
  --domain skincake.tw \
  --region asia-east1
```

> **注意**: 由於流量現在通過 Cloudflare 代理，您不再需要 Google Cloud Load Balancer，這簡化了架構並可能降低成本。Cloud Run 的自訂域名映射也可以直接由 Cloudflare 的 DNS 設置取代。

## 部署後檢查

### 1. 驗證服務狀態
```bash
# 檢查 Cloud Run 服務
gcloud run services describe skincake-app --region asia-east1

# 檢查 Cloud SQL 實例
gcloud sql instances describe skincake-db

# 檢查 Redis 實例
gcloud redis instances describe skincake-cache --region asia-east1
```

### 2. 測試應用程式
```bash
# 測試 HTTP 回應 (現在應通過您的域名)
curl -I https://www.skincake.tw

# 測試 API 端點
curl https://www.skincake.tw/api/health

# 測試資料庫連接
curl https://www.skincake.tw/api/db-status
```

### 3. 檢查監控指標
```bash
# 查看 Cloud Run 指標
gcloud run services describe skincake-app --region asia-east1 --format="get(status)"

# 查看日誌
gcloud run logs tail skincake-app --region asia-east1

# 查看錯誤報告
gcloud error-reporting events list --service skincake-app
```

## 維護操作

### 1. 更新應用程式
```bash
# 重新部署
gcloud builds submit --config cloudbuild.yaml .

# 檢查部署狀態
gcloud run revisions list --service skincake-app --region asia-east1
```

### 2. 擴展資源
```bash
# 更新 Cloud Run 設置
gcloud run services update skincake-app \
  --region asia-east1 \
  --memory 4Gi \
  --cpu 2 \
  --max-instances 200

# 擴展 Cloud SQL 實例
gcloud sql instances patch skincake-db \
  --tier db-standard-4
```

### 3. 備份與恢復
```bash
# 建立 Cloud SQL 備份
gcloud sql backups create --instance skincake-db

# 匯出資料庫
gcloud sql export sql skincake-db gs://skincake-backups/db-backup-$(date +%Y%m%d).sql \
  --database skincake_db

# 從備份恢復
gcloud sql backups restore BACKUP_ID \
  --restore-instance skincake-db
```

## 故障排除

### 1. 常見問題
- **部署失敗**：檢查 Cloud Build 日誌
- **資料庫連接失敗**：驗證 Cloud SQL 權限和網路設置
- **高延遲**：檢查 CDN 快取設置和資料庫查詢
- **記憶體不足**：增加 Cloud Run 記憶體限制

### 2. 除錯指令
```bash
# 查看 Cloud Build 日誌
gcloud builds log BUILD_ID

# 查看 Cloud Run 日誌
gcloud run logs read skincake-app --region asia-east1

# 查看 Cloud SQL 日誌
gcloud sql operations list --instance skincake-db

# 連接到 Cloud SQL
gcloud sql connect skincake-db --user skincake_user
```

## 成本優化

### 1. 監控成本
```bash
# 設置預算警報
gcloud alpha billing budgets create \
  --billing-account BILLING_ACCOUNT_ID \
  --display-name "SkinCake Monthly Budget" \
  --budget-amount 500USD \
  --threshold-rule threshold-percent=0.8,spend-basis=CURRENT_SPEND

# 查看成本分析
gcloud billing accounts list
```

### 2. 優化建議
- 使用 Cloud Run 最小實例數為 1
- 設置 Cloud SQL 自動暫停
- 使用 Cloud Storage 生命週期管理
- 定期審查未使用的資源

## 結語

這個部署指南提供了在 GCP 上部署 SkinCake 應用程式的完整流程。通過遵循這些步驟，您可以建立一個高可用性、可擴展且安全的生產環境。記住定期監控系統狀態並根據需要調整資源配置。 