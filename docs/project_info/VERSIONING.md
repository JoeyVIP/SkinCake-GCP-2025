# 版本管理規範

## 當前版本
- 版本號：1.5.0
- 更新日期：2024-05-19
- 更新內容：完成SPA架構中新分類頁的整合，修復文章頁面問題，新增品牌示範頁，並累積先前版本的多項新增與優化。

## 版本號格式
版本號格式為：主版本號.次版本號.修訂號（MAJOR.MINOR.PATCH）
- 主版本號：重大功能更新或架構變更時增加
- 次版本號：新功能添加時增加
- 修訂號：問題修復或小改進時增加

## 版本歷史
- 1.5.0 (2024-05-19)
  - **架構升級與核心功能**:
    - 完成技術債第四階段：新版分類頁已整合至 `index.html` SPA 架構。
    - 文章頁面功能修復與體驗優化。
    - 新增品牌示範頁面。
  - **先前版本累積更新 (v1.3.7 - v1.4.1)**:
    - 新增重要提示註解系統。
    - 新增工作流程自動化腳本。
    - 新增口語化指令系統。
    - 優化文檔結構與工作流程。
- 1.3.7 (2024-04-24)
  - 文檔結構優化：將相關 Markdown 文件移動到 docs/ 目錄。
  - 重要代碼註釋：為關鍵腳本添加了詳細的中文註釋。
  - 工作流程改進：引入 workflow.js 腳本和口語化指令支持。
- 1.3.6 (2024-04-23)
  - GA追蹤優化：修復SPA頁面中GA重複觸發的問題
  - 移除loadTrackingCode中的GA重複初始化
  - 保留文章頁面的手動page_view觸發
  - 優化追蹤代碼加載邏輯

- 1.3.5 (2024-04-22)
  - Sitemap 優化：改進 Sitemap 生成腳本
  - Metadata 管理：新增 Metadata KV 更新腳本
  - Worker 配置調整：更新 Cloudflare Worker 配置

- 1.3.4 (2024-04-21)
  - 分類頁面優化：將文章顯示數量上限從預設 10 篇增加至 100 篇

- 1.3.3 (2024-04-20)
  - 導航列優化：桌面版導航列連結改為依序淡入
  - 首頁卡片連結修正：確保連結在 JavaScript 映射失敗時仍有效

- 1.3.2 (2024-04-19)
  - GA 追蹤修復：在 SPA 架構下手動觸發 page_view 事件

- 1.3.1 (2024-04-18)
  - 文章頁面增強：添加社交分享按鈕和相關文章推薦
  - 文章頁面修復：調整分享按鈕位置與樣式

- 1.3.0 (2024-04-17)
  - SPA 路由：統一全站文章連結格式
  - 搜尋頁優化：修復特色圖片顯示問題
  - 首頁修復與優化：修復搜尋列功能

## 版本更新流程
1. 更新 package.json 中的版本號
2. 更新 VERSIONING.md 中的版本歷史
3. 更新 CHANGELOG.md 中的更新日誌
4. 提交版本更新相關文件
5. 創建新的版本標籤
6. 部署新版本

## 環境要求
- Node.js 版本：查看 `.nvmrc`
- 包管理器：npm
- 開發環境：
  - OS: macOS/Linux/Windows
  - 編輯器：建議使用 VS Code
  - 瀏覽器：Chrome/Safari/Firefox 最新版

## 開發環境設置
```bash
# 1. 確保使用正確的 Node.js 版本
nvm use

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev
```

## 環境配置文件
每個版本都包含以下環境配置文件：
- `.nvmrc`：Node.js 版本
- `package.json`：依賴包版本
- `package-lock.json`：依賴包精確版本鎖定
- `tsconfig.json`：TypeScript 配置（如果使用）
- `postcss.config.js`：PostCSS 配置
- `tailwind.config.js`：Tailwind CSS 配置

## 版本回退步驟
```bash
# 1. 切換到指定版本
git checkout v1.0.2

# 2. 清理環境
rm -rf node_modules package-lock.json

# 3. 重新安裝依賴
npm install

# 4. 啟動開發服務器
npm run dev
```

## 版本升級標準流程

### 1. 版本號更新
- 根據更新內容確定版本號（主版本號.次版本號.修訂號）
- 更新以下文件中的版本信息：
  ```bash
  package.json          # 更新 version 和 changelog
  README.md            # 在版本更新區塊添加新版本信息
  ENVIRONMENT.md       # 更新當前版本號
  其他相關配置文件      # 如有版本相關信息也需更新
  ```

### 2. 提交更改
```bash
# 添加更改的文件
git add package.json README.md ENVIRONMENT.md

# 提交更改（使用版本號）
git commit -m "release: 版本 x.x.x 發布

- 更新內容1
- 更新內容2
..."

# 創建版本標籤
git tag -a vx.x.x -m "版本 x.x.x"

# 推送到主分支
git push origin main

# 推送標籤
git push origin vx.x.x
```

### 3. 部署到生產環境
```bash
# 注意：本專案使用 GitHub 自動部署到 CFP
# 部署流程：
# 1. 提交代碼到 GitHub 主分支
# 2. GitHub Actions 會自動觸發部署流程
# 3. 部署完成後會自動更新到 CFP 環境

# 提交代碼
git add .
git commit -m "release: 版本 x.x.x 發布"
git push origin main
```

### 4. 部署後檢查
- 等待 GitHub Actions 部署完成
- 訪問 CFP 環境確認版本號更新
- 測試新功能是否正常
- 檢查是否有任何回歸問題
- 確認手機版和桌面版顯示效果
- 檢查控制台是否有錯誤

### 5. 文檔更新
- 確保所有文檔都已更新到新版本
- 檢查文檔中的版本號一致性
- 更新相關的API文檔（如果有）

## 版本說明文件格式

### package.json
```json
{
  "version": "1.0.2",
  "changelog": {
    "1.0.2": "新增手機版導航列心靈小語功能，提供溫馨勵志小語與可愛表情符號，每5分鐘自動更新",
    "1.0.1": "更新 Vercel 配置，添加 CORS 頭部設置，解決本地開發環境中導航欄 API 請求的跨域問題"
  }
}
```

### README.md
```markdown
## 版本更新

### v1.0.2 (2025-04-17)
- 新增手機版導航列心靈小語功能
- 提供15條溫馨勵志小語，每5分鐘自動更新
- 加入可愛表情符號與浮動動畫效果
- 優化手機版導航列視覺體驗
```

## 注意事項
1. 每次更新版本前，確保所有更改都經過充分測試
2. 版本說明要清晰、簡潔，突出重要更新內容
3. 保持版本號的連續性和規範性
4. 確保所有相關文件都同步更新
5. 在推送新版本前，先進行本地測試
6. 記錄重要的技術決策和改進點 

### 文件影響範圍

| 文件                   | 主要變更點                                           |
| ---------------------- | ---------------------------------------------------- |
| package.json           | 更新 version 欄位                                    |
| README.md              | 更新「最新版本」和「版本更新」區塊                     |
| docs/project_info/VERSIONING.md (本文件) | 更新「當前版本」和「版本歷史」                         |
| docs/config/ENVIRONMENT.md       | 更新當前版本號                                       |
| docs/guides/DEPLOYMENT_GUIDE.md    | 更新文檔頂部的版本號                                 |
| CHANGELOG.md           | 添加新版本的變更記錄                                 |
|                        |                                                      |

### Git 操作

```bash
git add package.json README.md docs/config/ENVIRONMENT.md docs/project_info/VERSIONING.md docs/guides/DEPLOYMENT_GUIDE.md CHANGELOG.md
``` 