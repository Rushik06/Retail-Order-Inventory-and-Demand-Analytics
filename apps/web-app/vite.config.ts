import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import path from "path";
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {

  const isProd = mode === "production";

  return {
    plugins: [
      react(),
      tailwindcss(),

      ...(isProd ? [] : [])
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      host: "0.0.0.0",
      port: 5173,
    },

    build: {
      outDir: "dist",
      sourcemap: !isProd,
    },
  };
});