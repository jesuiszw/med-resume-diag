/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'med-blue': '#1A73E8',
        'med-blue-dark': '#1557B0',
        'med-blue-light': '#E8F0FE',
        'med-gray': '#5F6368',
      },
    },
  },
  plugins: [],
};
