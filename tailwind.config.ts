import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAFAF8',
          100: '#F5F5F0',
          200: '#EBEBDF',
          300: '#D6D6C8',
          400: '#B0B09A',
          500: '#8A8A74',
        },
        ink: {
          50: '#F7F7F7',
          100: '#E8E8E8',
          200: '#D0D0D0',
          300: '#999',
          400: '#666',
          500: '#444',
          600: '#2A2A2A',
          700: '#1A1A1A',
        },
        accent: '#B47A3C',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
