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
        graphite: {
          950: "#0a0d0c",
          900: "#0f1412",
          800: "#161c19",
          700: "#1f2723",
          600: "#2b3531",
          500: "#3d4a44",
        },
        forest: {
          950: "#04140e",
          900: "#062018",
          800: "#0a2e22",
          700: "#0f4230",
          600: "#155a40",
          500: "#1c7350",
          400: "#2c9468",
          300: "#4db787",
        },
        emerald: {
          400: "#34d399",
          500: "#12b981",
          600: "#0a9b6c",
        },
        offwhite: {
          100: "#faf9f6",
          200: "#f2f0ea",
          300: "#e8e5dc",
        },
        teal: {
          400: "#2dd4c8",
          500: "#14b8ab",
        },
        gold: {
          400: "#d4af6a",
          500: "#c19a4b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(45,212,200,0.08), transparent 60%)",
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "flow-line": "flow-line 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "flow-line": {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      boxShadow: {
        premium:
          "0 1px 2px rgba(0,0,0,0.24), 0 12px 40px -12px rgba(0,0,0,0.5)",
        glow: "0 0 40px -8px rgba(45,212,200,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
