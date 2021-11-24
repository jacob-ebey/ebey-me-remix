module.exports = {
  mode: "jit",
  purge: ["./app/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {},
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
