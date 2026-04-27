import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
    proxy: {
      // Extract Tool API
      "/api": "http://localhost:3000",
      "/clones": "http://localhost:3000",
      // Medal Forge (Next.js)
      "/medal-forge-app": {
        target: "http://localhost:3001",
        rewrite: (path) => path.replace(/^\/medal-forge-app/, ""),
      },
    },
  },
});
