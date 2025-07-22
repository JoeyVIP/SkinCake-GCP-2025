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

// 環境檢測
const isProduction = process.env.NODE_ENV === 'production';
const isCloudRun = process.env.K_SERVICE !== undefined; // GCP Cloud Run 環境變數

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
 * 清理和標準化圖片 URL - GCP 環境優化
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  
  // 移除多餘的空白和換行
  url = url.trim();
  
  // 確保 HTTPS (GCP Cloud Run 強制要求)
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  
  // WordPress 特定處理：移除可能的查詢參數，避免圖片優化服務問題
  if (url.includes('skincake.online') && url.includes('?')) {
    // 保留 WordPress 的尺寸參數，但移除其他可能導致問題的參數
    const urlObj = new URL(url);
    const allowedParams = ['w', 'h', 'fit', 'crop'];
    const newSearchParams = new URLSearchParams();
    
    allowedParams.forEach(param => {
      const value = urlObj.searchParams.get(param);
      if (value !== null) {
        newSearchParams.set(param, value);
      }
    });
    
    url = `${urlObj.origin}${urlObj.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
  }
  
  return url;
}

/**
 * 從 WordPress 媒體物件獲取最佳圖片 URL - GCP 優化
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
 * 從 WordPress 文章獲取特色圖片 - GCP 環境優化
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
    
    // 提取圖片實際尺寸
    const width = featuredMedia.media_details?.width;
    const height = featuredMedia.media_details?.height;
    
    return {
      url,
      alt: featuredMedia.alt_text || post.title?.rendered || '文章圖片',
      width,
      height
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
 * 根據圖片尺寸計算智能的 aspect-ratio 和 CSS 樣式
 */
export function calculateImageStyles(imageSource: ImageSource): React.CSSProperties {
  // 如果沒有尺寸資訊，使用預設的最小高度
  if (!imageSource.width || !imageSource.height) {
    return {
      minHeight: '200px'
    };
  }
  
  const aspectRatio = imageSource.width / imageSource.height;
  
  // 根據比例判斷圖片類型並設定適當的樣式
  if (aspectRatio > 1.5) {
    // 橫向圖片 (寬 > 1.5 倍高)
    return {
      aspectRatio: `${imageSource.width} / ${imageSource.height}`,
      objectFit: 'cover' as const
    };
  } else if (aspectRatio < 0.8) {
    // 直立圖片 (高 > 1.25 倍寬)
    return {
      aspectRatio: `${imageSource.width} / ${imageSource.height}`,
      objectFit: 'contain' as const,
      minHeight: '300px'
    };
  } else {
    // 接近正方形的圖片
    return {
      aspectRatio: `${imageSource.width} / ${imageSource.height}`,
      objectFit: 'cover' as const
    };
  }
}

/**
 * 創建帶有錯誤處理的圖片 props - 伺服器端版本（無事件處理器）
 */
export function createImageProps(imageSource: ImageSource, fallback?: string) {
  const imageStyles = calculateImageStyles(imageSource);
  
  return {
    src: transformCdnUrl(imageSource.url),
    alt: imageSource.alt || '圖片',
    width: imageSource.width,
    height: imageSource.height,
    style: imageStyles,
    // GCP 環境：禁用圖片優化相關屬性
    ...(isCloudRun ? {
      unoptimized: true, // 強制禁用優化
      loader: undefined, // 不使用自定義載入器
    } : {}),
    // 移除事件處理器，避免 SSR 錯誤
  };
}

/**
 * 創建帶有事件處理器的圖片 props - 客戶端版本
 */
export function createImagePropsWithHandlers(imageSource: ImageSource, fallback?: string) {
  const finalFallback = fallback || DEFAULT_IMAGES.article;
  const baseProps = createImageProps(imageSource, fallback);
  
  return {
    ...baseProps,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      if (target.src !== finalFallback && !target.src.includes('default-post-image.svg')) {
        if (isCloudRun) {
          // GCP 環境：記錄詳細錯誤信息
          console.error('GCP image load failed:', {
            originalSrc: imageSource.url,
            failedSrc: target.src,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
            timestamp: new Date().toISOString(),
            environment: 'cloud-run'
          });
        } else {
          console.warn('Image failed to load:', {
            originalSrc: imageSource.url,
            failedSrc: target.src,
            fallback: finalFallback,
            alt: imageSource.alt
          });
        }
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

// 把 WordPress 圖片 URL 轉到 Jetpack CDN (Photon) 以獲取 WebP/AVIF 與壓縮
function transformCdnUrl(originalUrl: string): string {
  if (!isCloudRun) return originalUrl;

  try {
    const urlObj = new URL(originalUrl);
    if (!urlObj.hostname.includes('skincake.online')) {
      return originalUrl; // 非 WP 圖片不處理
    }

    // Photon 格式: https://i0.wp.com/{域名}{路徑}?w=1200&q=60&ssl=1
    const cdnBase = 'https://i0.wp.com';
    // 交由 Next.js Image remote loader 動態附加 w,q 參數
    const cdnUrl = `${cdnBase}/${urlObj.hostname}${urlObj.pathname}?ssl=1`;
    return cdnUrl;
  } catch {
    return originalUrl;
  }
}

/**
 * 創建圖片載入占位符 - GCP 環境優化
 */
export function getImagePlaceholder(width: number, height: number): string {
  // 生成一個簡單的 base64 編碼的 SVG 占位符 - 只使用 ASCII 字符避免 btoa 錯誤
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>
  `;
  
  try {
    // 安全的 base64 編碼處理
    const base64 = typeof btoa !== 'undefined' 
      ? btoa(encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))))
      : Buffer.from(svg, 'utf8').toString('base64');
      
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    // 如果編碼失敗，返回一個簡單的純色占位符
    if (isCloudRun) {
      console.error('GCP placeholder generation failed:', {
        width,
        height,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run'
      });
    }
    
    // 返回一個簡單的 data URL 佔位符
    return `data:image/svg+xml;charset=utf-8,<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23f3f4f6"/></svg>`;
  }
}

/**
 * 預載圖片並驗證是否可用 - GCP 環境優化
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
      if (isCloudRun) {
        console.error('GCP image preload failed:', {
          url,
          environment: 'cloud-run',
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn('Image preload failed:', url);
      }
      resolve(false);
    };
    
    // GCP 環境：設置特殊標頭
    if (isCloudRun && url.includes('skincake.online')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.src = url;
    
    // GCP 環境：延長超時時間（網路可能較慢）
    const timeout = isCloudRun ? 15000 : 10000;
    setTimeout(() => {
      if (isCloudRun) {
        console.error('GCP image preload timeout:', {
          url,
          timeout: `${timeout}ms`,
          environment: 'cloud-run'
        });
      } else {
        console.warn('Image preload timeout:', url);
      }
      resolve(false);
    }, timeout);
  });
}

/**
 * 檢查 WordPress 圖片 URL 是否可用 - GCP 環境優化
 */
export async function validateWordPressImage(url: string): Promise<boolean> {
  if (!url.includes('skincake.online')) return false;
  
  try {
    const headers: HeadersInit = {
      'User-Agent': 'SkinCake/2.0 (GCP Cloud Run)'
    };
    
    // GCP 環境：添加特殊標頭
    if (isCloudRun) {
      headers['X-Source'] = 'gcp-cloud-run';
      headers['X-Client'] = 'skincake-app';
    }
    
    const response = await fetch(url, { 
      method: 'HEAD',
      headers
    });
    
    return response.ok;
  } catch (error) {
    if (isCloudRun) {
      console.error('GCP WordPress image validation failed:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: 'cloud-run',
        timestamp: new Date().toISOString()
      });
    } else {
      console.warn('WordPress image validation failed:', url, error);
    }
    return false;
  }
} 