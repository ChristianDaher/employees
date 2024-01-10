import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Titillium Web", ...defaultTheme.fontFamily.sans],
        secondary: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        default: "rgb(var(--color-default)/<alpha-value>)",
        primary: "rgb(var(--color-primary)/<alpha-value>)",
        secondary: "rgb(var(--color-secondary)/<alpha-value>)",
        accent: "rgb(var(--color-accent)/<alpha-value>)",
        hover: "rgb(var(--color-hover)/<alpha-value>)",
        background: "rgb(var(--color-background)/<alpha-value>)",
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [],
};

export default config;
