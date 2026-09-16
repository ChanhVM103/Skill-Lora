/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        code: ['"Fira Code"', 'monospace'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        'ueh-teal': '#005d68',
        'ueh-darkteal': '#004750',
        'ueh-orange': '#f37021',
        'ueh-green': '#82b440',
        primary: {
          DEFAULT: '#6366F1',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        cta: {
          DEFAULT: '#10B981',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        }
      },
    },
  },
  plugins: [],
}
