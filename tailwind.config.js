/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F1F4FF",
          secondary: "#002E6A",
          container: "#FFFFFF"
        },
        primary: "#002E6A",
        secondary: "#31B8CC",
        font: {
          DEFAULT: "#2D2D2D",
          secondary: "#FFFFFF",
          tertiary: "#7E8184"
        }
      },
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
      },
      fontSize: {
        regular: '1.1rem',
        small: '0.9rem',
        xsmall: '0.75rem'
      },
      borderColor: {
        DEFAULT: "#C5C5C5"
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(36deg, #00224F 29.01%, #003D8B 75.13%)',
      },
    },
  },
  plugins: [],
}