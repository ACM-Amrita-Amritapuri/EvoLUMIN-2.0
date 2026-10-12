/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Preflight is off so the existing custom styles in src/index.css render exactly as designed.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: { bg: "#05060a", card: "#0d1018", acc: "#19d3ff", acc2: "#ff2d3d", mut: "#a3aec9" },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
