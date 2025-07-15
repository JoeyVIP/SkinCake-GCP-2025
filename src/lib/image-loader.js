/**
 * 自定義圖片載入器 - GCP Cloud Run 環境專用
 * 用於繞過 Next.js 圖片優化服務，直接返回原始圖片 URL
 */

export default function imageLoader({ src, width, quality }) {
  // 如果是本地圖片（以 / 開頭），直接返回
  if (src.startsWith('/')) {
    return src;
  }

  // 如果是 WordPress 圖片，直接返回原始 URL 不進行優化
  if (src.includes('skincake.online')) {
    // 確保使用 HTTPS
    const httpsUrl = src.replace('http://', 'https://');
    return httpsUrl;
  }

  // 其他外部圖片也直接返回原始 URL
  return src;
} 