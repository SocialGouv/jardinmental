const { colors } = require('./src/utils/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.LIGHT_BLUE,
          50: "#eefdfd",
          100: "#d4f8f9",
          200: "#aef0f3",
          300: "#76e3ea",
          400: "#37cdd9",
          500: colors.LIGHT_BLUE,
          600: "#1a8ea0",
          700: "#1c7282",
          800: "#1f5e6b",
          900: "#1e4e5b",
        },
        secondary: {
          DEFAULT: '#12747D',
        },
        red: {
          DEFAULT: "#f16b6b",
          50: "#fdf3f3",
          100: "#fde3e3",
          200: "#fccccc",
          300: "#f8a9a9",
          400: "#f16b6b",
          500: "#e84b4b",
          600: "#d42e2e",
          700: "#b22323",
          800: "#942020",
          900: "#7b2121",
        },
        green: {
          DEFAULT: "#5dee5a",
          50: "#f0feef",
          100: "#dbffd9",
          200: "#b9fcb6",
          300: "#80f87d",
          400: "#5dee5a",
          500: "#18d314",
          600: "#0daf0a",
          700: "#0d890c",
          800: "#106c0f",
          900: "#0e590f",
        },
        blue: {
          DEFAULT: "#EBFDFF"
        },
        brand: {
          DEFAULT: '#134449',
          900: '#134449',
          950: '#093F43',
          800: '#12747D',
          600: '#1CB2BF',
          25: '#FAFFFF'
        },
        gray: {
          950: '#093F43',
          800: '#4A5D5F',
          700: '#617778',
          300: '#C7DDDE',
          200: '#E3F6F8',
          100: '#EEF9FA',
          50: '#F7FCFD'
        },
        beige: {
          DEFAULT: '#FCEBD9'
        },
        mood: {
          5: '#21896B'
        }
      },
      fontFamily: {
        title: ['Karla', 'sans-serif'],
        body: ['Karla', 'sans-serif'],
      },
      fontSize: {
        'display-md': ['36px', {
          lineHeight: '44px',
          // letterSpacing: '-0.02em'
        }],
        'display-xs': ['24px', {
          lineHeight: '32px',
          // letterSpacing: '0em'
        }],
        'display-xs-regular': ['24px', {
          lineHeight: '32px',
          // letterSpacing: '0em'
        }],
        'text-5xl': ['48px', { lineHeight: '48px' }],
        'text-xl': ['20px', {
          lineHeight: '30px',
          // letterSpacing: '0em'
        }],
        'text-md': ['16px', {
          lineHeight: '24px',
          // letterSpacing: '0em'
        }],
        'text-sm': ['14px', {
          lineHeight: '100%',
          // letterSpacing: '0em'
        }],
        'text-xs': ['12px', {
          lineHeight: '100%',
          // letterSpacing: '0em'
        }],
      },
    },
  },
  plugins: [],
};
