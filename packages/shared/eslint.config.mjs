import { defineConfig } from "eslint/config";

import { baseEslintConfig } from "@taskflow/config-eslint";

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
  ...baseEslintConfig,
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/*.config.*",
      "**/tsconfig*.json",
    ],
  },
]);
