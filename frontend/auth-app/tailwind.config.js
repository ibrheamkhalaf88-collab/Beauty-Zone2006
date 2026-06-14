/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-warm': '#faf7f5',
        'primary': '#8B3A3A',
        'secondary': '#C4A35A',
        'accent': '#F0E6D3',
        'text-dark': '#2C1810',
        'text-mid': '#6B4C3B',
        'text-light': '#9C7A6A',
        'surface': '#ffffff',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Tajawal', 'sans-serif'],
        'en': ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 2px 16px rgba(44, 24, 16, 0.08)',
        'md': '0 8px 40px rgba(44, 24, 16, 0.14)',
        'lg': '0 20px 70px rgba(44, 24, 16, 0.2)',
      },
    },
  },
  plugins: [],
}
