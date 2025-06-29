/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#ecf2ff',
          100: '#b1c8fb',
          200: '#6196ff',
          300: '#043aff',
          400: '#0000db',
          500: '#0808a0',
          600: '#06066f',
          700: '#040525',
        },
        gray: {
          0: '#ffffff',
          10: '#f1f1f1',
          20: '#eaeaea',
          30: '#dedede',
          40: '#9b9b9b',
          50: '#696969',
          60: '#313131',
          70: '#222222',
          80: '#181818',
        },
        orange: {
          10: '#ffeec2',
          20: '#fcb73e',
          30: '#ef8b17',
          40: '#d97400',
          80: '#432f18',
        }
      },
      fontFamily: {
        'national': ['National', 'system-ui', 'sans-serif'],
        'founders': ['FoundersGrotesk', 'system-ui', 'sans-serif'],
        'mono': ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}