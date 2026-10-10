/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        investigative: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-raised': 'var(--color-surface-raised)',
          border: 'var(--color-border)',
          'border-muted': 'var(--color-border-muted)',
          text: 'var(--color-text)',
          'text-muted': 'var(--color-text-muted)',
          violet: {
            DEFAULT: '#6c5fc7',
            accent: '#7e70d9',
            dark: '#5a4fa8',
            hover: '#54499e',
            subtle: 'rgba(108, 95, 199, 0.12)',
            glow: 'rgba(126, 112, 217, 0.14)',
          }
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
