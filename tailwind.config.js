/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./theme.config.tsx",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: "#0071e3",
          gray: "#f5f5f7",
          "dark-gray": "#1d1d1f",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
