/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#FFB7C5',
        'primary-pink-dark': '#FF9AAD',
        'primary-pink-light': '#FFE5E9',
      },
    },
  },
  plugins: [],
  // 生產環境 CSS 最佳化
  corePlugins: {
    // 移除不常用的功能以減少 CSS 大小
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    scrollSnapType: false,
    scrollSnapAlign: false,
    touchAction: false,
    userSelect: false,
    resize: false,
    placeholderColor: false,
    placeholderOpacity: false,
    caretColor: false,
    accentColor: false,
  }
}; 