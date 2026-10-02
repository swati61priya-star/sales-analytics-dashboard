const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        soft: token('soft'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        sidebar: token('sidebar'),
        sage: { DEFAULT: token('sage'), l: token('sage-l'), d: token('sage-d') },
        blue: { DEFAULT: token('blue'), l: token('blue-l'), d: token('blue-d') },
        rose: { DEFAULT: token('rose'), l: token('rose-l'), d: token('rose-d') },
        peach: { DEFAULT: token('peach'), l: token('peach-l'), d: token('peach-d') },
        lav: { DEFAULT: token('lav'), l: token('lav-l'), d: token('lav-d') },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(80, 95, 85, 0.18)',
        lift: '0 18px 40px -16px rgba(80, 95, 85, 0.28)',
      },
    },
  },
  plugins: [],
}
