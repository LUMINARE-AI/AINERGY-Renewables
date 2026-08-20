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
        // Light-mode neutrals — warm paper, not clinical white.
        paper: {
          50: "#FCFAF5",
          100: "#F7F2E8",
          200: "#EFE7D4",
          300: "#E2D6B8",
        },
        // Light-mode text / ink family.
        ink: {
          950: "#15130E",
          900: "#211D15",
          800: "#332C1F",
          700: "#4A4130",
          600: "#665A42",
          500: "#847758",
          400: "#A89C7E",
        },
        // Signature accent — "current": copper/amber, the brand's one
        // distinctive color. Used for primary CTAs, live/AI moments, focus.
        current: {
          300: "#F8C976",
          400: "#F0A93E",
          500: "#D98A1E",
          600: "#AD6B14",
          700: "#7E4E0F",
        },
        // Secondary accent — positive/savings/success, also used as the
        // "green energy" note without leaning on teal like every competitor.
        forest: {
          950: "#04140e",
          900: "#062018",
          800: "#0a2e22",
          700: "#0f4230",
          600: "#155a40",
          500: "#1c7350",
          400: "#2c9468",
          300: "#4db787",
          200: "#8fd4ac",
        },
        // Dark "control room" mode — reserved for the Energy Copilot and
        // authenticated analysis product, not the marketing chrome.
        graphite: {
          950: "#0a0d0c",
          900: "#0f1412",
          800: "#161c19",
          700: "#1f2723",
          600: "#2b3531",
          500: "#3d4a44",
          400: "#5c6a63",
        },
        // Legacy tokens kept for backward compatibility during the
        // redesign — prefer paper/ink/current/forest in new work.
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
          "radial-gradient(circle at 50% 0%, rgba(217,138,30,0.10), transparent 60%)",
        "current-gradient": "linear-gradient(120deg, #F0A93E 0%, #D98A1E 55%, #AD6B14 100%)",
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "flow-line": "flow-line 3s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2.2s linear infinite",
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        premium:
          "0 1px 2px rgba(21,19,14,0.06), 0 16px 40px -16px rgba(21,19,14,0.18)",
        "premium-lg":
          "0 2px 4px rgba(21,19,14,0.06), 0 30px 60px -20px rgba(21,19,14,0.22)",
        glow: "0 0 40px -8px rgba(217,138,30,0.45)",
        "glow-dark": "0 0 40px -8px rgba(240,169,62,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
