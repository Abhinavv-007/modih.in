import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0d12",
        paper: "#f7f4ef",
        accent: "#f26a2e",
        accent2: "#0f6d5f",
        slate: "#1b2430",
        fog: "#cfd4df"
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(242, 106, 46, 0.2), 0 12px 40px rgba(15, 109, 95, 0.2)",
        soft: "0 8px 30px rgba(11, 13, 18, 0.08)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(242, 106, 46, 0.25), transparent 55%), radial-gradient(circle at 20% 20%, rgba(15, 109, 95, 0.2), transparent 50%)"
      }
    }
  },
  plugins: []
};

export default config;
