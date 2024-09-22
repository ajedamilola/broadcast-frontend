/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0389c9",
      },
      fontFamily: {
        ["montserrat"]: ["montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
