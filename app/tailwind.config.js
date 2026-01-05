const { colors } = require("./src/utils/colors");

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
          800: "#3D6874",
          900: "#1e4e5b",
        },
        secondary: {
          DEFAULT: "#12747D",
        },
        red: {
          DEFAULT: "#f16b6b",
          text: "#5A2017",
          bg: "#F9DCD7",
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
          text: "#224E2D",
          bg: "#DDF3E3",
          "bg-darken": "#BBE7C6",
        },
        blue: {
          DEFAULT: "#EBFDFF",
        },
        "cnam-primary": {
          950: "#28464D",
          900: "#134449",
          800: "#3D6874",
          700: "#518B9A",
          500: "#65AEC1",
          400: "#84BECD",
          300: "#A3CEDA",
          200: "#C1DFE6",
          100: "#E0EFF3",
          50: "#F0F7F9",
          25: "#FAFDFD",
        },
        "cnam-cyan": {
          "lighten-90": "#E5F6FC",
          "lighten-80": "#CCEDF9",
          "25-lighten-97": "#F7FCFE",
          "darken-20": "#0084B2",
          "50-lighten-90": "#E5F6FC",
          "500-0": "#00A5DF",
          "600-darken-20": "#0084B2",
          "700-darken-40": "#006386",
          "200-lighten-60": "#99DBF2",
        },
        "cnam-jaune": {
          100: "#FCF0D3",
          500: "#F0B323",
          900: "#302407",
        },
        brand: {
          DEFAULT: "#134449",
          900: "#134449",
          950: "#093F43",
          800: "#12747D",
          600: "#1CB2BF",
          25: "#FAFFFF",
          accent: "#E5F6FC",
        },
        gray: {
          950: "#093F43",
          900: "#354445",
          800: "#4A5D5F",
          700: "#617778",
          600: "#799092",
          500: "#92A9AB",
          400: "#ACC3C5",
          300: "#C7DDDE",
          200: "#E3F6F8",
          100: "#EEF9FA",
          50: "#F7FCFD",
        },
        beige: {
          DEFAULT: "#FCEBD9",
        },
        mood: {
          5: "#99DDDD", //'#21896B',
          4: "#BBE7C6",
          3: "#F9E1A7",
          2: "#F3B9B0",
          1: "#F3A3CD", //'#822F2F'
        },
        "mood-text": {
          4: "#224E2D",
        },
        "cnam-vert": {
          "100-lighten-80": "#DDF3E3",
          "200-lighten-60": "#BBE7C6",
          "800-darken-60": "#224E2D",
        },
        "cnam-rouge": {
          "100-lighten-80": "#F9DCD7",
          "800-lighten-60": "#5A2017",
        },
        "cnam-mauve": {
          "lighten-80": "#ECDEF0",
          "darken-40": "#60376D",
        },
        success: {
          bg: "#DDF3E3",
          "bg-darken": "#BBE7C6",
          text: "#224E2D",
        },
        error: {
          bg: "#F9DCD7",
          text: "#5A2017",
        },
      },
      fontFamily: {
        title: ["SourceSans3", "sans-serif"],
        body: ["SourceSans3", "sans-serif"],
        sans: ["SourceSans3", "sans-serif"],
      },
      fontSize: {
        "display-md": [
          "36px",
          {
            lineHeight: "44px",
            // letterSpacing: '-0.02em'
          },
        ],
        "display-xs": [
          "24px",
          {
            lineHeight: "32px",
            // letterSpacing: '0em'
          },
        ],
        "display-xs-regular": [
          "24px",
          {
            lineHeight: "32px",
            // letterSpacing: '0em'
          },
        ],
        "text-5xl": ["48px", { lineHeight: "48px" }],
        "text-xl": [
          "20px",
          {
            lineHeight: "30px",
            // letterSpacing: '0em'
          },
        ],
        "text-lg": [
          "18px",
          {
            lineHeight: "26px",
            // letterSpacing: '0em'
          },
        ],
        "text-base": [
          "16px",
          {
            lineHeight: "24px",
            // letterSpacing: '0em'
          },
        ],
        "text-sm": [
          "14px",
          {
            lineHeight: "100%",
            // letterSpacing: '0em'
          },
        ],
        "text-xs": [
          "12px",
          {
            lineHeight: "100%",
            // letterSpacing: '0em'
          },
        ],
      },
    },
  },
  plugins: [],
};
