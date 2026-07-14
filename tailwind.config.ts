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
        // --- Industrial SaaS Palette ---
        "app-bg": "#0F1117",
        "surface-1": "#161B26",
        "surface-2": "#1C2333",
        "surface-3": "#232B3E",
        "panel-bg": "#161B26",
        "card-bg": "#1C2333",

        // Accent: Teal / Cyan
        "accent-primary": "#00D4AA",
        "accent-hover": "#00E6BB",
        "accent-soft": "#5EEAD4",
        "accent-muted": "rgba(0, 212, 170, 0.15)",

        // Secondary accent: Blue
        "accent-blue": "#0EA5E9",
        "accent-blue-soft": "#38BDF8",

        // Text
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",

        // Status
        "status-success": "#34D399",
        "status-warning": "#FBBF24",
        "status-danger": "#F87171",
        "status-info": "#60A5FA",

        // Borders
        "border-subtle": "rgba(255, 255, 255, 0.06)",
        "border-default": "rgba(255, 255, 255, 0.10)",
        "border-strong": "rgba(255, 255, 255, 0.16)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accent-gradient": "linear-gradient(135deg, #00D4AA 0%, #0EA5E9 100%)",
        "accent-gradient-soft": "linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(14,165,233,0.15) 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
      },
      backgroundSize: {
        "grid-pattern": "40px 40px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,170,0.1)",
        "card-glow": "0 0 20px rgba(0,212,170,0.08)",
        "panel": "0 4px 16px rgba(0,0,0,0.3)",
        "dropdown": "0 12px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink": "blink 1.2s step-end infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
