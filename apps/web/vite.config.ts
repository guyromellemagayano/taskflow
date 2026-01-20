import { loadEnvConfig } from "@next/env";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, "../../");
loadEnvConfig(projectDir);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@web": path.resolve(__dirname, "./"),
    },
  },
});
