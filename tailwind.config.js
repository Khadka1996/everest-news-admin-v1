/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'source-sans': ['Source Sans Pro', 'sans-serif'],
        'preeti': ['Preeti', 'sans-serif'],
        'kantipur': ['Kantipur', 'sans-serif'],
        'mangal': ['Mangal', 'serif'],
        
      },
    },
  },
  plugins: [],
}