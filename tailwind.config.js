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
            DEFAULT: '#6d28d9',
            accent: '#7c3aed',
            dark: '#5b21b6',
            hover: '#4c1d95',
            subtle: 'rgba(109, 40, 217, 0.14)',
            glow: 'rgba(124, 58, 237, 0.20)',
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
