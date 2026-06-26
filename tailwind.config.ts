import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f7f3ee",
        ink: "#1f2937",
        accent: "#a65d57",
        accentSoft: "#e7c6b8",
        focus: "#0f766e",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        base: ["16px", "1.6"],
      },
    },
  },
  plugins: [],
} satisfies Config;
