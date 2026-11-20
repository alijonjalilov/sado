import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" }, screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#0B0B0C", 900: "#0B0B0C", 800: "#121214", 700: "#18181B" },
        graphite: { DEFAULT: "#1E1E22", 600: "#26262B", 500: "#33333A", 400: "#4A4A52" },
        gold: { DEFAULT: "#C9A55C", light: "#E3C78A", pale: "#F1E2BF", dark: "#9C7C3C" },
        milk: { DEFAULT: "#F7F3EC", dim: "#EDE7DC" },
        beige: { DEFAULT: "#E8DCC8", dark: "#CDBDA2" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { luxe: "0.32em" },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E3C78A 0%, #C9A55C 45%, #9C7C3C 100%)",
        "fade-b": "linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(11,11,12,0.85) 70%, #0B0B0C 100%)",
      },
      boxShadow: {
        gold: "0 10px 40px -12px rgba(201,165,92,0.45)",
        card: "0 30px 60px -30px rgba(0,0,0,0.7)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(8px)" } },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
