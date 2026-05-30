import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: "#F59E0B",
          500: "#D97706",
          600: "#B45309",
        },
        elite: {
          dark: "#0A0A0A",
          gray: "#1A1A1A",
          light: "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Bebas Neue", "sans-serif"],
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
}

export default config