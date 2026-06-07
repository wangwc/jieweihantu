import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F1E8",
        card: "#FFFDF8",
        ink: "#1F1B16",
        muted: "#6F675D",
        line: "#DDD2C3",
        cinnabar: "#9E2F1C",
        gold: "#B08A45",
        teal: "#2F6F73",
        panel: "#171412",
        danger: "#8B2C2C",
        ok: "#2F6B4F"
      },
      fontFamily: {
        sans: ["Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", "PingFang SC", "Arial", "sans-serif"],
        serif: ["Noto Serif SC", "Songti SC", "SimSun", "serif"]
      },
      boxShadow: {
        archive: "0 12px 30px rgba(31, 27, 22, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
