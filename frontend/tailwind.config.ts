import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
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
        // test: "rgb(var(--color-test) / <alpha-value>)", // For later darkmode lightmode stuff
      },
    },
  },
  // darkMode: ["class", '[data-theme="dark"]'], // For later darkmode lightmode stuff
  plugins: [],
};
export default config;
