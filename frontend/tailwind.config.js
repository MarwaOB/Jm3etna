/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        yellowMain: "#FFD700",
        greenMain: "#54BD95",
        dark: "#000000",
        grey: "#E5E5E5",
        white: "#F8F8F8"
      },
      fontFamily: {
        title: ["'Playfair Display'", "serif"],
        body: ["Lato", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
