import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  logLevel: "error",
  base: "/",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
  css: { postcss: "./postcss.config.js" },
  plugins: [react()],
});
