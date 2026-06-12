import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "app-bg": "#1A171A",
        "panel-bg": "#27272A",
        "card-bg": "#18181B",
        "accent-primary": "#E879F9",
        "accent-soft": "#F0ABFC",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A3A3A3",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
      },
      backgroundImage: {
        "map-grid":
          "linear-gradient(rgba(232,121,249,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,121,249,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "map-grid": "40px 40px",
      },
      boxShadow: {
        "card-glow": "0 4px 24px rgba(232,121,249,0.08)",
        "card-hover": "0 8px 32px rgba(232,121,249,0.18)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink": "blink 1.2s step-end infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
