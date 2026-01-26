/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#065F46', // Forest Green
          dark: '#042f2e',
          light: '#059669',
        },
        accent: {
          DEFAULT: '#10B981', // Emerald Green
          hover: '#34D399',
        },
        secondary: '#ECFDF5', // Mint Cream
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
