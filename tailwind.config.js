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
          DEFAULT: '#fe3c72',
          light: '#ff6b96',
          dark: '#e0325f',
        },
        secondary: {
          DEFAULT: '#ffffff',
          dark: '#f5f5f5',
        },
        tertiary: {
          DEFAULT: '#fd5564',
          light: '#ff7a86',
          dark: '#e04450',
        },
      },
    },
  },
  plugins: [],
}