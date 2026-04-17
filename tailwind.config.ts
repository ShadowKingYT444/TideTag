import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
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
          400: '#34a88a',
          500: '#0e7c66',
          600: '#0a6754',
          700: '#0a5444',
        },
        ink: {
          900: '#0b1220',
          800: '#0f1a2e',
          700: '#16223a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glass: '0 1px 2px rgba(15,23,42,0.04), 0 10px 30px -15px rgba(15,23,42,0.18)',
        'glass-lg': '0 1px 2px rgba(15,23,42,0.04), 0 24px 60px -25px rgba(15,23,42,0.28)',
        'inner-glass': 'inset 0 1px 0 rgba(255,255,255,0.8)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 400ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
