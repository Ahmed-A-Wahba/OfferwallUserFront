/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace']
      },
      colors: {
        darkBg: '#080810',
        cardBg: '#12121E',
        purpleAccent: '#7C3AED',
        lightPurple: '#D2BBFF',
        mutedText: '#CCC3D8'
      }
    },
  },
  plugins: [],
}
