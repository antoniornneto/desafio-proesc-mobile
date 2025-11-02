/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{ts,tsx}', './src/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        poppins_regular: ['Poppins-Regular'],
        poppins_medium: ['Poppins-Medium'],
        poppins_bold: ['Poppins-Bold'],
      },
    },
  },
  plugins: [],
};
