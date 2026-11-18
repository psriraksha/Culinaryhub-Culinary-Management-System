/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff8ed',
          100: '#ffefd3',
          200: '#ffd9a5',
          300: '#ffbc6d',
          400: '#ff9533',
          500: '#ff7510',
          600: '#f05a06',
          700: '#c74107',
          800: '#9e340e',
          900: '#7f2d0f',
        },
        saffron: {
          400: '#f5a623',
          500: '#e8960f',
          600: '#d4840a',
        },
        amber: {
          warm: '#FFA500',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #ff7510 0%, #f5a623 50%, #ffbc6d 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
        'warm-gradient': 'linear-gradient(135deg, #fff8ed 0%, #ffefd3 100%)',
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(255, 117, 16, 0.15)',
        'warm-lg': '0 8px 40px rgba(255, 117, 16, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
