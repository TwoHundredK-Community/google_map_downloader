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
          DEFAULT: '#00A651',
          50: '#E6F7EF',
          100: '#CCEFE0',
          200: '#99DFC1',
          300: '#66CFA2',
          400: '#33BF83',
          500: '#00A651',
          600: '#008541',
          700: '#006431',
          800: '#004220',
          900: '#002110'
        },
        secondary: {
          DEFAULT: '#2C3E50',
          50: '#E8ECF0',
          100: '#D1D9E0',
          200: '#A3B3C2',
          300: '#758DA3',
          400: '#476785',
          500: '#2C3E50',
          600: '#233240',
          700: '#1A2530',
          800: '#111920',
          900: '#080C10'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 