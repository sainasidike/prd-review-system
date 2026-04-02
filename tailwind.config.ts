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
        notion: {
          bg: '#FFFFFF',
          'bg-hover': '#F7F7F5',
          'bg-active': '#EFEFED',
          fg: '#37352F',
          'fg-secondary': '#787774',
          'fg-muted': '#B4B4B0',
          border: '#E9E9E7',
          accent: '#2383E2',
          'accent-light': '#E8F0FE',
          red: '#EB5757',
          orange: '#D9730D',
          green: '#0F7B6C',
        },
      },
    },
  },
  plugins: [],
}

export default config
