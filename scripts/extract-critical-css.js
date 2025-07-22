const critical = require('critical');
const path = require('path');
const fs = require('fs');

// 關鍵 CSS 設定
const viewports = [
  { width: 320, height: 480 },   // 手機
  { width: 768, height: 1024 },  // 平板
  { width: 1200, height: 900 }   // 桌面
];

async function extractCriticalCSS() {
  try {
    console.log('🎯 開始提取關鍵 CSS...');
    
    // 確保輸出目錄存在
    const outputDir = path.join(__dirname, '../public/css');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 提取首頁關鍵 CSS
    console.log('📱 提取首頁關鍵 CSS...');
    const homeCritical = await critical.generate({
      base: path.join(__dirname, '../.next/static/'),
      src: 'http://localhost:3000',
      dest: path.join(outputDir, 'critical-home.css'),
      width: 1200,
      height: 900,
      dimensions: viewports,
      extract: false, // 不移除關鍵 CSS，保留完整樣式
      inlineImages: false,
      timeout: 30000,
      ignore: {
        atrule: ['@font-face'], // 忽略字體，我們會單獨處理
      },
      penthouse: {
        timeout: 60000,
      }
    });

    console.log('📄 提取文章頁關鍵 CSS...');
    // 取一個範例文章頁面 
    const articleCritical = await critical.generate({
      base: path.join(__dirname, '../.next/static/'),
      src: 'http://localhost:3000/blog/不是只有咖啡聖水洞這幾間主題感咖啡廳好拍又好',
      dest: path.join(outputDir, 'critical-article.css'),
      width: 1200,
      height: 900,
      dimensions: viewports,
      extract: false,
      inlineImages: false,
      timeout: 30000,
      ignore: {
        atrule: ['@font-face'],
      },
      penthouse: {
        timeout: 60000,
      }
    });

    // 合併關鍵 CSS
    const combinedCritical = `
/* 首頁關鍵 CSS */
${homeCritical.css}

/* 文章頁關鍵 CSS */
${articleCritical.css}
`.trim();

    // 寫入合併的關鍵 CSS
    fs.writeFileSync(path.join(outputDir, 'critical-combined.css'), combinedCritical);
    
    console.log('✅ 關鍵 CSS 提取完成！');
    console.log(`- 首頁: ${Math.round(homeCritical.css.length / 1024 * 10) / 10}KB`);
    console.log(`- 文章頁: ${Math.round(articleCritical.css.length / 1024 * 10) / 10}KB`);
    console.log(`- 合併後: ${Math.round(combinedCritical.length / 1024 * 10) / 10}KB`);

  } catch (error) {
    console.error('❌ 提取關鍵 CSS 失敗:', error);
    process.exit(1);
  }
}

// 簡化版：提取基礎關鍵 CSS
async function extractBasicCritical() {
  try {
    console.log('🎯 提取基礎關鍵 CSS（無需伺服器）...');
    
    // 手動定義最關鍵的 CSS
    const criticalCSS = `
/* 基礎重置與佈局 */
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
*{margin:0}
html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
body{margin:0;line-height:inherit}
img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}
img,video{max-width:100%;height:auto}

/* 字體載入最佳化 */
@font-display:swap;

/* 重要佈局 */
.container{width:100%}
@media (min-width:640px){.container{max-width:640px}}
@media (min-width:768px){.container{max-width:768px}}
@media (min-width:1024px){.container{max-width:1024px}}
@media (min-width:1280px){.container{max-width:1280px}}

/* 顏色系統 */
.bg-white{background-color:#fff}
.bg-gray-50{background-color:#f9fafb}
.text-gray-800{color:#1f2937}
.text-gray-500{color:#6b7280}

/* 關鍵網格 */
.grid{display:grid}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
@media (min-width:768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1024px){.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}

/* 關鍵 flex */
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.justify-between{justify-content:space-between}

/* 間距 */
.p-4{padding:1rem}
.px-4{padding-left:1rem;padding-right:1rem}
.py-8{padding-top:2rem;padding-bottom:2rem}
.mb-8{margin-bottom:2rem}
.gap-6{gap:1.5rem}

/* 關鍵圓角 */
.rounded-lg{border-radius:0.5rem}

/* 關鍵陰影 */
.shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}

/* 首屏重要樣式 */
.min-h-screen{min-height:100vh}
.aspect-video{aspect-ratio:16/9}
.aspect-square{aspect-ratio:1/1}

/* 粉色主題色 */
.bg-\\[\\#FFF9FA\\]{background-color:#FFF9FA}
.bg-\\[\\#FFE5E9\\]{background-color:#FFE5E9}
.text-\\[\\#FF8599\\]{color:#FF8599}
.text-\\[\\#FFB7C5\\]{color:#FFB7C5}

/* 響應式隱藏/顯示 */
.hidden{display:none}
@media (min-width:768px){.md\\:block{display:block}}

/* 過渡效果（首屏不需要，但很小） */
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
`.replace(/\s+/g, ' ').trim();

    // 確保輸出目錄存在
    const outputDir = path.join(__dirname, '../public/css');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 寫入關鍵 CSS
    fs.writeFileSync(path.join(outputDir, 'critical.css'), criticalCSS);
    
    console.log('✅ 基礎關鍵 CSS 生成完成！');
    console.log(`- 大小: ${Math.round(criticalCSS.length / 1024 * 10) / 10}KB`);

  } catch (error) {
    console.error('❌ 生成關鍵 CSS 失敗:', error);
    process.exit(1);
  }
}

// 根據參數決定執行哪種模式
const mode = process.argv[2] || 'basic';
if (mode === 'full') {
  extractCriticalCSS();
} else {
  extractBasicCritical();
} 