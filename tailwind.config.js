/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sbu-red': '#D52027',
        'sbu-navy': '#002244',
        'sbu-royal': '#00549A',
        'sbu-gray': '#4B4B4B',
      },
      fontFamily: {
        'display': ['Alumni Sans', 'system-ui', 'sans-serif'],
        'body': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

