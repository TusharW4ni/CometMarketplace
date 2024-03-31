/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [/^mantine-/],
    },
  },
  theme: {
    extend: {},
  },
  plugins: [],
}