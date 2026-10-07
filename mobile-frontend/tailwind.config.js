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
        },
        // Grid Governance Corporate Palette
        governance: {
          surface: '#f8f9ff',
          'surface-dim': '#cbdbf5',
          'surface-bright': '#f8f9ff',
          'inverse-surface': '#213145',
          'inverse-on-surface': '#eaf1ff',
          primary: '#006c49',
          'primary-container': '#10b981',
          'inverse-primary': '#4edea3',
          secondary: '#006398',
          'secondary-container': '#5bb8fe',
          tertiary: '#565e74',
          'tertiary-container': '#9ba2bb',
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.35s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce-slow 2.5s infinite ease-in-out',
        'scanline': 'scanline 4s linear infinite',
        'arrow-hit': 'arrow-hit 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'target-shake': 'target-shake 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'trophy-bounce': 'trophy-bounce 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite',
        'confetti-pop': 'confetti-pop 3s ease-out infinite',
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
        },
        'arrow-hit': {
          '0%, 100%': { transform: 'translate(30px, -30px) scale(1.2)', opacity: '0' },
          '8%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '85%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '95%': { opacity: '0' }
        },
        'target-shake': {
          '0%, 6%, 100%': { transform: 'rotate(0) scale(1)' },
          '8%': { transform: 'rotate(-8deg) scale(0.92) translate(-1px, 1px)' },
          '12%': { transform: 'rotate(5deg) scale(1.08) translate(1px, -1px)' },
          '16%': { transform: 'rotate(-2deg) scale(0.98)' },
          '22%': { transform: 'rotate(0) scale(1) translate(0, 0)' },
        },
        'trophy-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '5%': { transform: 'translateY(-12px) scale(1.15)' },
          '10%': { transform: 'translateY(0) scale(0.9)' },
          '15%': { transform: 'translateY(-4px) scale(1.05)' },
          '22%': { transform: 'translateY(0) scale(1)' },
        },
        'confetti-pop': {
          '0%, 100%': { transform: 'translate(0, 0) scale(0)', opacity: '0' },
          '6%': { transform: 'translate(var(--tx), calc(var(--ty) - 5px)) scale(1) rotate(var(--rot))', opacity: '1' },
          '25%': { transform: 'translate(calc(var(--tx) * 1.5), calc(var(--ty) * 1.5 + 20px)) scale(0) rotate(calc(var(--rot) * 3))', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
