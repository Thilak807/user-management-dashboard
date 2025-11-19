/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        accent: '#93C5FD',
        slate: {
          850: '#1E293B',
        },
      },
      boxShadow: {
        'card-lg': '0 20px 45px -15px rgba(37, 99, 235, 0.25)',
      },
    },
  },
  plugins: [],
};

