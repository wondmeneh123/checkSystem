import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://script.google.com/macros/s/AKfycbxNrhBmLAQ6irQTr5PawrCZuEoVUebRQnJ6yiKPjM9BOhBsV0IZkWWtN6P_86J-QdYS/exec",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
