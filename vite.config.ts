import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@uilibrary": path.resolve(__dirname, "ui-library"),
    },
  },
  server: {
    port: 3333,
    proxy: {
      "/api": "http://localhost:3000",
      "/clones": "http://localhost:3000",
    },
  },
});
