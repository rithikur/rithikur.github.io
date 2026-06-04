import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        volt: 'var(--color-volt, #ccff00)',
        dark: '#050505',
        panel: '#111111',
        border: '#262626',
      },
    },
  },
  plugins: [],
} satisfies Config
