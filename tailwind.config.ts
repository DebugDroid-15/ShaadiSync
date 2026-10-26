import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ShaadiSync Indian Wedding Theme Tokens
        navy: {
          50: "#f0f4f9",
          100: "#d9e2ee",
          200: "#b3c6dc",
          300: "#8da9cb",
          400: "#5580b0",
          500: "#2a5b95",
          600: "#1e4677",
          700: "#172b4d", // Deep Navy Brand Base
          800: "#122039",
          900: "#0c1524",
        },
        gold: {
          50: "#fbf8f0",
          100: "#f6eedb",
          200: "#ecdbb4",
          300: "#e0c48a",
          400: "#d4ad5f",
          500: "#c6a15b", // Muted Gold Accent
          600: "#a9833f",
          700: "#84632f",
          800: "#604724",
          900: "#3d2d17",
        },
        ivory: {
          50: "#ffffff",
          100: "#faf8f2", // Warm Ivory Background
          200: "#f4f0e4",
          300: "#ece5d3",
          400: "#ded4bc",
          500: "#cbbe9f",
        },
        terracotta: {
          50: "#fef3f2",
          100: "#fee4e2",
          500: "#e05338",
          600: "#c83d25",
        },
        emerald: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#16a34a",
          600: "#15803d",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(23, 43, 77, 0.05), 0 1px 2px 0 rgba(23, 43, 77, 0.03)",
        card: "0 4px 6px -1px rgba(23, 43, 77, 0.07), 0 2px 4px -1px rgba(23, 43, 77, 0.04)",
        elevated: "0 10px 15px -3px rgba(23, 43, 77, 0.1), 0 4px 6px -2px rgba(23, 43, 77, 0.05)",
      }
    },
  },
  plugins: [],
};

export default config;

