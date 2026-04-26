import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  // GitHub Pages publishes at https://ali6134.github.io/judas/
  // Use that base for the production build; keep "/" for `npm run dev`.
  base: command === "build" ? "/judas/" : "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 2048,
  },
}));
