import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        // keep motion out of the entry chunk
        manualChunks: id => /node_modules[\/](motion|motion-dom|motion-utils|framer-motion)[\/]/.test(id) ? "motion" : undefined,
      },
    },
  },
});
