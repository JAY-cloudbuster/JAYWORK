/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'light-gray': '#f8f9fa',
        'pumpkin': '#FD802E',
        'charcoal': '#233D4C',
      }
    },
  },
  plugins: [],
}