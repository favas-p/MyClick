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
        apple: {
          bg: "#f5f5f7",
          darkBg: "#000000",
          card: "rgba(255, 255, 255, 0.75)",
          cardDark: "rgba(28, 28, 30, 0.75)",
          border: "rgba(210, 210, 215, 0.5)",
          borderDark: "rgba(50, 50, 55, 0.5)",
          blue: "#0071e3",
          blueHover: "#0077ed",
          green: "#34c759",
          red: "#ff3b30",
          grayText: "#86868b",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        glassHover: "0 12px 40px 0 rgba(0, 0, 0, 0.12)",
        subtle: "0 2px 10px rgba(0,0,0,0.04)",
      },
      backdropBlur: {
        apple: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
