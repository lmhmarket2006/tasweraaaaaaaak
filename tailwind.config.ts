import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1B9AAA",
          teal: "#2EC4B6",
          orange: "#E8572A",
          red: "#C1440E",
        },
        dark: {
          900: "#0A0F0D",
          800: "#111816",
          700: "#1A2420",
          600: "#243028",
        },
        text: {
          primary: "#F5F0EB",
          secondary: "#A8B5B0",
          muted: "#6B7F79",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #1B9AAA 0%, #2EC4B6 40%, #E8572A 100%)",
        "gradient-hero":
          "linear-gradient(160deg, #0D2B35 0%, #1B4A52 50%, #2A1810 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
