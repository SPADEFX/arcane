import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@uilibrary/ui/components": path.resolve(__dirname, "ui-library/components"),
      "@uilibrary/ui/sections": path.resolve(__dirname, "ui-library/sections"),
      "@uilibrary/ui": path.resolve(__dirname, "ui-library/index.ts"),
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
