/**
 * 圖片處理工具函數
 * 提供強健的 WordPress 圖片 URL 處理和驗證
 */

export interface ImageSource {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// 預設圖片配置
const DEFAULT_IMAGES = {
  article: '/images/default-post-image.svg',
  category: '/images/default-category.svg',
  user: '/images/default-avatar.svg'
} as const;

/**
 * 驗證圖片 URL 是否有效
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // 檢查是否為有效的 URL
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // 檢查是否為圖片格式
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i;
  return imageExtensions.test(url);
}

/**
 * 清理和標準化圖片 URL
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  
  // 移除多餘的空白和換行
  url = url.trim();
  
  // 確保 HTTPS
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  
  // WordPress 特定處理：移除可能的查詢參數
  if (url.includes('skincake.online') && url.includes('?')) {
    url = url.split('?')[0];
  }
  
  return url;
}

/**
 * 從 WordPress 媒體物件獲取最佳圖片 URL
 */
export function getBestImageUrl(media: any): string {
  if (!media) return DEFAULT_IMAGES.article;
  
  // 優先順序：source_url > sizes.large > sizes.medium > sizes.thumbnail
  const candidates = [
    media.source_url,
    media.media_details?.sizes?.large?.source_url,
    media.media_details?.sizes?.medium?.source_url,
    media.media_details?.sizes?.medium_large?.source_url,
    media.media_details?.sizes?.thumbnail?.source_url,
  ].filter(Boolean);
  
  for (const url of candidates) {
    const cleanUrl = sanitizeImageUrl(url);
    if (isValidImageUrl(cleanUrl)) {
      return cleanUrl;
    }
  }
  
  return DEFAULT_IMAGES.article;
}

/**
 * 從 WordPress 文章獲取特色圖片
 */
export function getFeaturedImageFromPost(post: any): ImageSource {
  const defaultImage = {
    url: DEFAULT_IMAGES.article,
    alt: '預設文章圖片'
  };
  
  // 檢查 _embedded 中的特色媒體
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  if (featuredMedia) {
    const url = getBestImageUrl(featuredMedia);
    return {
      url,
      alt: featuredMedia.alt_text || post.title?.rendered || '文章圖片',
      width: featuredMedia.media_details?.width,
      height: featuredMedia.media_details?.height
    };
  }
  
  // 備用：直接檢查 featured_media
  if (post.featured_media && typeof post.featured_media === 'string') {
    const url = sanitizeImageUrl(post.featured_media);
    if (isValidImageUrl(url)) {
      return {
        url,
        alt: post.title?.rendered || '文章圖片'
      };
    }
  }
  
  return defaultImage;
}

/**
 * 創建帶有錯誤處理的圖片 props
 */
export function createImageProps(imageSource: ImageSource, fallback?: string) {
  const finalFallback = fallback || DEFAULT_IMAGES.article;
  
  return {
    src: imageSource.url,
    alt: imageSource.alt || '圖片',
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      if (target.src !== finalFallback && !target.src.includes('default-post-image.svg')) {
        console.warn('WordPress image failed to load:', {
          originalSrc: imageSource.url,
          failedSrc: target.src,
          fallback: finalFallback,
          alt: imageSource.alt
        });
        target.src = finalFallback;
      }
    },
    onLoad: () => {
      // 成功載入時的可選回調
      if (process.env.NODE_ENV === 'development') {
        console.log('Image loaded successfully:', imageSource.url);
      }
    }
  };
}

/**
 * 預載圖片並驗證是否可用
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isValidImageUrl(url)) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => {
      console.warn('Image preload failed:', url);
      resolve(false);
    };
    img.src = url;
    
    // 10秒超時（WordPress 圖片可能比較慢）
    setTimeout(() => {
      console.warn('Image preload timeout:', url);
      resolve(false);
    }, 10000);
  });
}

/**
 * 檢查 WordPress 圖片 URL 是否可用
 */
export async function validateWordPressImage(url: string): Promise<boolean> {
  if (!url.includes('skincake.online')) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('WordPress image validation failed:', url, error);
    return false;
  }
}

/**
 * 獲取圖片的 base64 placeholder
 */
export function getImagePlaceholder(width: number = 800, height: number = 600): string {
  // 使用簡單的 data URI，避免 btoa 編碼問題
  return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='16'%3E載入中...%3C/text%3E%3C/svg%3E`;
} 