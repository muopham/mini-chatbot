import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ec5b13",
        "accent-yellow": "#FFD60A",
        "accent-orange": "#FF7A00",
        "background-light": "#FFF9E6",
        background: "#fff9e8",
        "background-dark": "#221610",
        "surface-container": "#f4eedb",
        "surface-container-low": "#f9f3e1",
        "surface-container-high": "#eee8d5",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#e8e2d0",
        "secondary-container": "#fb7800",
        "primary-container": "#FFD60A",
        "on-background": "#1e1c11",
        "on-surface": "#1e1c11",
        secondary: "#994700",
        surface: "#fff9e8",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        outline: "#7f775f",
      },
      fontFamily: {
        display: ["var(--font-public-sans)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        headline: ["var(--font-plus-jakarta)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderWidth: {
        "4": "4px",
      },
      boxShadow: {
        neo: "8px 8px 0px 0px rgba(0,0,0,1)",
        "neo-sm": "4px 4px 0px 0px rgba(0,0,0,1)",
        editorial: "4px 4px 0px 0px #1E1C11",
        "editorial-lg": "8px 8px 0px 0px #1E1C11",
      },
      borderRadius: {
        DEFAULT: "0px",
        lg: "0px",
        xl: "0px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
