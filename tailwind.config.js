/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f131d',
        surface: '#0f131d',
        'surface-container-lowest': '#0a0e18',
        'surface-container-low': '#171b26',
        'surface-container': '#1c1f2a',
        'surface-container-high': '#262a35',
        'surface-container-highest': '#313540',
        primary: '#4cd7f6',
        'primary-container': '#06b6d4',
        secondary: '#d0bcff',
        'secondary-container': '#571bc1',
        tertiary: '#4edea3',
        'tertiary-container': '#1bbd85',
        'on-surface': '#dfe2f1',
        'on-surface-variant': '#bcc9cd',
        error: '#ffb4ab',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
