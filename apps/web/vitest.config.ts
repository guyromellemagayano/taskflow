import { loadEnvConfig } from "@next/env";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

import reactPreset from "@taskflow/vitest-presets/react";

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
  test: {
    ...reactPreset.test,
    isolate: false,
    maxWorkers: 1,
    maxConcurrency: 1,
    testTimeout: 5000,
    hookTimeout: 5000,
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    logHeapUsage: true,
    sequence: {
      concurrent: false,
    },
  },
});
