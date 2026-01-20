import { baseEslintConfig } from "@taskflow/config-eslint";
import { defineConfig } from "eslint/config";

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
