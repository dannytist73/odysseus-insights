/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.ejs", "./public/**/*.{js,css}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff8f0",
          100: "#ffeedd",
          200: "#ffdbc2",
          300: "#ffb991",
          400: "#ff9066",
          500: "#ff784d",
          600: "#ff5733",
          700: "#e64e2d",
          800: "#cc4427",
          900: "#b33b21",
        },
        secondary: {
          50: "#f0faff",
          100: "#e0f2ff",
          200: "#bae6ff",
          300: "#7dd3ff",
          400: "#38bfff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        arimo: ["Arimo", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
    },
  },
  plugins: [],
};
