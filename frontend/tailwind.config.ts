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

        // ── Amber Burn dark tokens ───────────────────────────────────────────
        "dark-bg-page":    "#100e07",
        "dark-bg-surface": "#1a1609",
        "dark-bg-sidebar": "#22190a",
        "dark-bg-card":    "#2a1f0c",
        "dark-bg-input":   "#31260f",

        "dark-accent":       "#f59e0b",
        "dark-accent-deep":  "#d97706",
        "dark-accent-on":    "#100e07",

        "dark-border":        "#f59e0b",
        "dark-border-subtle": "#3d300f",

        "dark-text-primary":   "#fef3c7",
        "dark-text-secondary": "#d4b483",
        "dark-text-tertiary":  "#7a6535",

        "dark-online":  "#34d399",
        "dark-error":   "#f87171",
        "dark-success": "#34d399",
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
        // Dark mode (Amber Burn)
        amber: "4px 4px 0px 0px #f59e0b",
        "amber-lg": "8px 8px 0px 0px #f59e0b",
        "amber-sm": "3px 3px 0px 0px #f59e0b",
        "amber-subtle": "3px 3px 0px 0px #3d300f",
        "amber-send": "2px 2px 0px 0px #92400e",
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
