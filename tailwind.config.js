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
          red: {
            DEFAULT: '#991b1b',
            accent: '#b91c1c',
            hover: '#7f1d1d',
            subtle: 'rgba(153, 27, 27, 0.15)',
            glow: 'rgba(185, 28, 28, 0.25)',
          }
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Space Grotesk', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
