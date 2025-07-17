# 開發指南

本指南涵蓋 SkinCake 專案的開發規範和最佳實踐。

## 開發環境

### 推薦的 IDE 設置

#### VS Code
推薦安裝以下擴展：
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Path Intellisense

#### 設置檔案
`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 編碼規範

### TypeScript 規範

1. **類型定義**
```typescript
// ✅ 好的做法
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ 避免使用 any
const data: any = fetchData();
```

2. **函數定義**
```typescript
// ✅ 明確的參數和返回類型
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### React 組件規範

1. **組件結構**
```typescript
// ✅ 使用函數組件和 TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

2. **Hooks 使用**
```typescript
// ✅ 自定義 Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 樣式規範

1. **Tailwind CSS 使用**
```tsx
// ✅ 使用 Tailwind 類
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">標題</h2>
</div>

// ✅ 使用 cn 工具合併類
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)}>
```

## 專案結構

### 檔案命名
- **組件**: PascalCase (e.g., `ArticleCard.tsx`)
- **工具函數**: camelCase (e.g., `formatDate.ts`)
- **常數**: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### 目錄結構
```
src/components/
├── ui/               # 基礎 UI 組件
├── layout/           # 佈局組件
└── features/         # 功能組件
```

## Git 工作流程

### 分支策略
- `main`: 生產環境分支
- `develop`: 開發分支
- `feature/*`: 功能分支
- `hotfix/*`: 緊急修復分支

### Commit 規範
使用語意化提交訊息：
```bash
feat: 新增搜尋功能
fix: 修復文章載入問題
docs: 更新 README
style: 調整按鈕樣式
refactor: 重構 API 模組
test: 新增單元測試
chore: 更新依賴
```

## API 開發

### WordPress API 整合
```typescript
// lib/wordpress-api.ts
export async function getPost(slug: string): Promise<Post> {
  const response = await fetch(
    `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
    { next: { revalidate: 60 } }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  
  const posts = await response.json();
  return posts[0];
}
```

### 錯誤處理
```typescript
// ✅ 優雅的錯誤處理
try {
  const data = await fetchData();
  return { success: true, data };
} catch (error) {
  console.error('Error fetching data:', error);
  return { success: false, error: error.message };
}
```

## 性能優化

### 圖片優化
```tsx
import Image from 'next/image';

// ✅ 使用 Next.js Image 組件
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL={placeholderUrl}
/>
```

### 代碼分割
```typescript
// ✅ 動態導入
const DynamicComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton /> }
);
```

## 測試

### 單元測試
```typescript
// __tests__/utils.test.ts
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-01-17');
    expect(formatDate(date)).toBe('2025年1月17日');
  });
});
```

### 執行測試
```bash
# 執行所有測試
npm test

# 監視模式
npm test -- --watch

# 覆蓋率報告
npm test -- --coverage
```

## 除錯技巧

### React Developer Tools
1. 安裝 React Developer Tools 瀏覽器擴展
2. 使用 Components 標籤檢查組件樹
3. 使用 Profiler 標籤分析性能

### Console 除錯
```typescript
// 開發環境除錯
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 部署前檢查

### 檢查清單
- [ ] 執行 `npm run build` 確認無錯誤
- [ ] 執行 `npm run lint` 檢查代碼規範
- [ ] 執行 `npm test` 確認測試通過
- [ ] 更新版本號和 CHANGELOG
- [ ] 檢查環境變數配置

---

更多詳細資訊請參考[技術架構](../technical/architecture.md)和[API 參考](../technical/api-reference.md)。 