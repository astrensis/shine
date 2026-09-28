/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        line: {
          green: '#06C755',
          bubble: '#8DE055',
          bg: '#8DBEE6',
        },
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2px, 1px)' },
          '20%': { transform: 'translate(2px, -1px)' },
          '30%': { transform: 'translate(-3px, 0px)' },
          '40%': { transform: 'translate(3px, 1px)' },
          '50%': { transform: 'translate(-1px, -2px)' },
          '60%': { transform: 'translate(1px, 2px)' },
          '70%': { transform: 'translate(-2px, -1px)' },
          '80%': { transform: 'translate(2px, 1px)' },
          '90%': { transform: 'translate(-1px, 0px)' },
        },
        'flash-red': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(220, 38, 38, 0.35)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        bounce1: {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '46%': { opacity: '0.3' },
          '47%': { opacity: '1' },
          '48%': { opacity: '0.2' },
          '49%': { opacity: '1' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        'shake-hard': 'shake 0.15s ease-in-out infinite',
        'flash-red': 'flash-red 0.5s ease-in-out 3',
        'pulse-slow': 'pulse-slow 1.5s ease-in-out infinite',
        flicker: 'flicker 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
