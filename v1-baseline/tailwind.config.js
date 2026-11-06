/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-bottom-2': {
          '0%': { opacity: '0', transform: 'translateY(0.5rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'in': 'fade-in 300ms ease-out',
        'fade-in': 'fade-in 300ms ease-out',
        'slide-in-from-bottom-2': 'slide-in-from-bottom-2 300ms ease-out',
      },
    },
  },
  plugins: [],
};
