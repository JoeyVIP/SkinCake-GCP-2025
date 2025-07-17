# 安裝指南

本指南將幫助您在本地環境設置 SkinCake 專案。

## 系統需求

### 必要條件
- **Node.js**: 14.0.0 或更高版本
- **npm**: 6.0.0 或更高版本（隨 Node.js 安裝）
- **Git**: 用於版本控制

### 推薦環境
- **作業系統**: macOS、Linux 或 Windows 10+
- **編輯器**: VS Code（推薦）或其他支援 TypeScript 的編輯器
- **瀏覽器**: Chrome、Firefox、Safari 或 Edge（最新版本）

## 安裝步驟

### 1. 克隆專案

```bash
# 使用 HTTPS
git clone https://github.com/JoeyVIP/SkinCake-GCP-2025.git

# 或使用 SSH
git clone git@github.com:JoeyVIP/SkinCake-GCP-2025.git

# 進入專案目錄
cd SkinCake-GCP-2025
```

### 2. 安裝依賴

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 3. 環境設置

創建環境變數檔案：

```bash
# 複製環境變數範本
cp .env.example .env.local
```

編輯 `.env.local` 檔案：

```env
# WordPress API 設置
WORDPRESS_API_URL=https://skincake.online/wp-json/wp/v2

# 網站配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=SkinCake 肌膚蛋糕

# Google Analytics (可選)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Facebook Pixel (可選)
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX
```

### 4. 啟動開發伺服器

```bash
# 開發模式
npm run dev

# 開啟瀏覽器
# http://localhost:3000
```

## 驗證安裝

### 檢查清單
- [ ] 首頁正常載入
- [ ] 文章列表顯示
- [ ] 圖片正確顯示
- [ ] 導航功能正常
- [ ] 控制台無錯誤

### 常見問題

#### 1. 依賴安裝失敗

```bash
# 清理快取
npm cache clean --force

# 刪除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

#### 2. 開發伺服器無法啟動

```bash
# 檢查端口是否被佔用
lsof -i :3000

# 使用其他端口
PORT=3001 npm run dev
```

#### 3. API 連接失敗

確認 WordPress API 可訪問：
```bash
curl https://skincake.online/wp-json/wp/v2/posts
```

## 開發工具設置

### VS Code 擴展推薦
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Auto Rename Tag

### Git 設置

```bash
# 設置用戶資訊
git config user.name "您的名字"
git config user.email "your.email@example.com"

# 設置預設分支
git config init.defaultBranch main
```

## 下一步

安裝完成後，您可以：
- 閱讀[開發指南](./development.md)了解開發規範
- 查看[配置說明](./configuration.md)了解詳細配置
- 參考[部署指南](./deployment.md)了解如何部署

---

如有問題，請參考[故障排除](../maintenance/troubleshooting.md)或提交 Issue。 