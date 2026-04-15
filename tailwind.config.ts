import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tide: {
          50: '#eff8ff',
          100: '#daeeff',
          200: '#bde0ff',
          300: '#8ccdff',
          400: '#54b0ff',
          500: '#2d90ff',
          600: '#1670f5',
          700: '#1259e0',
          800: '#1649b4',
          900: '#18408e',
          950: '#0d2657',
        },
        kelp: {
          500: '#0e7c66',
          600: '#0a6754',
          700: '#0a5444',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
