import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        'academic-navy': '#1a365d',
        'academic-blue': '#2b6cb0',
        'academic-gold': '#d69e2e',
        ivory: {
          DEFAULT: '#FFFEF8',
          50: '#FFFEF8',
          100: '#FFFDF5',
          200: '#FFFCF0',
        },
        section: {
          light: '#FFFEF8',
          dark: '#F5F3ED',
          darker: '#EBE9E3',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-literata)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
