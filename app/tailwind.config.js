/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1fc6d5",
          50: "#eefdfd",
          100: "#d4f8f9",
          200: "#aef0f3",
          300: "#76e3ea",
          400: "#37cdd9",
          500: "#1fc6d5",
          600: "#1a8ea0",
          700: "#1c7282",
          800: "#1f5e6b",
          900: "#1e4e5b",
        },
      },
    },
  },
  plugins: [],
};
