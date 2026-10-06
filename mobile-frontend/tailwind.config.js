/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Logo Green
        emerald: {
          50: '#ecf8ef',
          100: '#d1eed8',
          200: '#a8dfb7',
          300: '#72c88c',
          400: '#43af68',
          500: '#44B369', // exact logo green
          600: '#208d47',
          700: '#1b6f3a',
          800: '#185830',
          900: '#154929',
          950: '#0b2816',
        },
        // Logo Dark Blue
        teal: {
          50: '#f0f6fd',
          100: '#dcebfa',
          200: '#c1ddf7',
          300: '#96c7f1',
          400: '#64abe8',
          500: '#4090dd',
          600: '#115497', // mapped 600 to exact logo dark blue (since it's used in gradients)
          700: '#235da3',
          800: '#204f85',
          900: '#14355e', 
          950: '#122c4f',
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.35s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce-slow 2.5s infinite ease-in-out',
        'scanline': 'scanline 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15%)' },
        },
        'scanline': {
          '0%': { transform: 'translate3d(-100%, -100%, 0)' },
          '100%': { transform: 'translate3d(100%, 100%, 0)' },
        }
      }
    },
  },
  plugins: [],
}
