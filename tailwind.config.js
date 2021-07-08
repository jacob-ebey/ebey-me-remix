module.exports = {
  purge: ["./app/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {},
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
