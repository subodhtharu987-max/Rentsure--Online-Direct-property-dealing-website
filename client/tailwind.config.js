/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#fef7ee', 100:'#fdecd3', 200:'#fbd5a5', 300:'#f9b86e', 400:'#f69034', 500:'#f47316', 600:'#e55a0c', 700:'#be430c', 800:'#973512', 900:'#7a2d12', 950:'#421507' },
        dark: { 900:'#0f0f0f', 800:'#1a1a1a', 700:'#242424', 600:'#2e2e2e', 500:'#3a3a3a' }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }
      }
    }
  },
  plugins: []
}
