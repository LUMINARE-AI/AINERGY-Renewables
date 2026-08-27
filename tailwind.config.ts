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
        // Light-mode neutrals — cool off-white from the logo cream.
        paper: {
          50: "#F7F8F6",
          100: "#EEF2F1",
          200: "#DCE6E5",
          300: "#C5D2D1",
        },
        // Light-mode text / ink family — cool charcoal matching the wordmark.
        ink: {
          950: "#0D1213",
          900: "#151C1D",
          800: "#232C2E",
          700: "#3A4749",
          600: "#556366",
          500: "#728082",
          400: "#94A1A3",
        },
        // Signature accent — logo teal. CTAs, eyebrows, live/AI moments.
        current: {
          300: "#8FDBDF",
          400: "#3ABBC2",
          500: "#08797F",
          600: "#06666B",
          700: "#044C50",
        },
        // Secondary accent — deeper petrol-teal for success / energy notes.
        forest: {
          950: "#031110",
          900: "#05201E",
          800: "#08302D",
          700: "#0B4540",
          600: "#0E5C56",
          500: "#147A72",
          400: "#2A9A91",
          300: "#5BBDB4",
          200: "#9FD9D3",
        },
        // Dark "control room" mode — teal-tinted graphite.
        graphite: {
          950: "#071011",
          900: "#0C1618",
          800: "#121D1F",
          700: "#1A2729",
          600: "#263638",
          500: "#38494B",
          400: "#5A6C6E",
        },
        emerald: {
          400: "#3ABBC2",
          500: "#08797F",
          600: "#06666B",
        },
        offwhite: {
          100: "#F6F8F7",
          200: "#E8EEED",
          300: "#D5DEDD",
        },
        teal: {
          400: "#3ABBC2",
          500: "#08797F",
        },
        // Companion accent — warm copper, complementary to the logo teal.
        gold: {
          300: "#E8C07A",
          400: "#D4A05A",
          500: "#C9893A",
          600: "#A36C28",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(8,121,127,0.10), transparent 60%)",
        "current-gradient": "linear-gradient(120deg, #3ABBC2 0%, #08797F 55%, #06666B 100%)",
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
          "0 1px 2px rgba(13,18,19,0.06), 0 16px 40px -16px rgba(13,18,19,0.18)",
        "premium-lg":
          "0 2px 4px rgba(13,18,19,0.06), 0 30px 60px -20px rgba(13,18,19,0.22)",
        glow: "0 0 40px -8px rgba(8,121,127,0.45)",
        "glow-dark": "0 0 40px -8px rgba(58,187,194,0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
