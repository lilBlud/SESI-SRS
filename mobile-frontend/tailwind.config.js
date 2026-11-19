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
        // Logo Green (OKLCH perceptually calibrated)
        emerald: {
          50: 'oklch(0.97 0.022 148)',
          100: 'oklch(0.93 0.048 148)',
          200: 'oklch(0.86 0.088 148)',
          300: 'oklch(0.77 0.124 148)',
          400: 'oklch(0.69 0.145 148)',
          500: 'oklch(0.66 0.148 148)', // exact logo green in OKLCH
          600: 'oklch(0.55 0.135 148)',
          700: 'oklch(0.46 0.115 148)',
          800: 'oklch(0.39 0.095 148)',
          900: 'oklch(0.34 0.08 148)',
          950: 'oklch(0.22 0.055 148)',
        },
        // Logo Dark Blue (OKLCH perceptually calibrated)
        teal: {
          50: 'oklch(0.96 0.018 242)',
          100: 'oklch(0.92 0.036 242)',
          200: 'oklch(0.86 0.062 242)',
          300: 'oklch(0.78 0.092 242)',
          400: 'oklch(0.70 0.115 242)',
          500: 'oklch(0.62 0.130 242)',
          600: 'oklch(0.44 0.125 250)', // mapped 600 to exact logo dark blue
          700: 'oklch(0.46 0.115 250)',
          800: 'oklch(0.41 0.095 250)',
          900: 'oklch(0.33 0.075 250)',
          950: 'oklch(0.28 0.065 250)',
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
        'trophy-bounce': 'trophy-bounce 0.75s cubic-bezier(0.16, 1, 0.3, 1) 1 both',
        'confetti-pop': 'confetti-pop 0.85s cubic-bezier(0.16, 1, 0.3, 1) 1 both',
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
          '0%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-8px) scale(1.12)' },
          '62%': { transform: 'translateY(0) scale(0.95)' },
          '82%': { transform: 'translateY(-2px) scale(1.03)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        'confetti-pop': {
          '0%': { transform: 'translate(0, 0) scale(0)', opacity: '0' },
          '25%': { transform: 'translate(var(--tx), calc(var(--ty) - 4px)) scale(1) rotate(var(--rot))', opacity: '1' },
          '100%': { transform: 'translate(calc(var(--tx) * 1.45), calc(var(--ty) * 1.45 + 18px)) scale(0) rotate(calc(var(--rot) * 2.5))', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
