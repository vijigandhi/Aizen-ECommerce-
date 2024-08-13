
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'grabbg':'#F4F5F7',
        'adminbg':'#F4F5F7',
        'primary-green': '#4CAF50',
        'primary-greened': '#457a45',
        'primary-pink': '#f43f5e',
        'primary-orange': '#FF9800',
        'secondary-yellow': '#FFEB3B',
        'secondary-dark-blue': '#003366',
        'secondary-light-gray': '#F5F5F5',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
