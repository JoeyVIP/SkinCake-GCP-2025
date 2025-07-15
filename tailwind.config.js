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
}; 