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
          50: '#eef8fc',
          100: '#d7eef8',
          200: '#b5dff2',
          300: '#81c7e9',
          400: '#46aada',
          500: '#238fc6',
          600: '#1b71a4',
          700: '#175b85',
          800: '#154e6e',
          900: '#15425c',
        },
        success: {
          50: '#effaf2',
          100: '#d9f2e0',
          200: '#b5e3c4',
          300: '#85cd9f',
          400: '#52b276',
          500: '#309556',
          600: '#217741',
          700: '#1c5e35',
          800: '#184b2c',
          900: '#143e26',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
