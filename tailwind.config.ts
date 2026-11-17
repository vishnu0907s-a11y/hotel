import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0B0B0B",
          secondary: "#141414",
          card: "#181818",
          elevated: "#1F1F1F",
        },
        gold: {
          light: "#E5C588",
          DEFAULT: "#C8A96A",
          dark: "#9D7E3F",
          muted: "rgba(200, 169, 106, 0.15)",
          border: "rgba(200, 169, 106, 0.25)",
        },
        ivory: {
          DEFAULT: "#F5F0E8",
          muted: "#A5A19A",
          subtle: "#736F69",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          gold: "rgba(200, 169, 106, 0.2)",
          hover: "rgba(200, 169, 106, 0.4)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E5C588 0%, #C8A96A 50%, #9D7E3F 100%)",
        "radial-vignette": "radial-gradient(circle at center, transparent 40%, #0B0B0B 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(28,28,28,0.7) 0%, rgba(18,18,18,0.95) 100%)",
      },
      letterSpacing: {
        widest: "0.25em",
        ultra: "0.35em",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

