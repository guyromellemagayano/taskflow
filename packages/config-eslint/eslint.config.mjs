import { defineConfig } from "eslint/config";

import { baseEslintConfig } from "./src/index.js";

export default defineConfig([
  ...baseEslintConfig,
  {
    ignores: ["dist/**", "**/dist/**"],
  },
]);
