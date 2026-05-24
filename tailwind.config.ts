import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        forest: {
          950: '#050d07',
          900: '#0a1a0d',
          800: '#0f2413',
          700: '#163520',
          600: '#1a4228',
        },
      },
    },
  },
  plugins: [],
}

export default config