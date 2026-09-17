import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        bone: "rgb(var(--color-bone) / <alpha-value>)",
        ash: "rgb(var(--color-ash) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        ember: "rgb(var(--color-ember) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      letterSpacing: {
        editorial: "-0.055em",
        label: "0.14em",
      },
      transitionTimingFunction: {
        "editorial-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
