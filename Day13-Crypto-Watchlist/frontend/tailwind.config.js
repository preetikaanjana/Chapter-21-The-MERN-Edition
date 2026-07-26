/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD6E0', lavender: '#E8D5F2', mint: '#D4F1E8', peach: '#FFE5D4',
          sky: '#D4E8F7', lemon: '#FFF4D4', rose: '#F8BBD9', lilac: '#C5B4E3', cream: '#FFF8F0', text: '#5C5470',
        },
      },
      fontFamily: { sans: ['Nunito', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
