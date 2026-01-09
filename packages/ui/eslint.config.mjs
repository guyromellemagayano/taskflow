import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/*.config.*",
      "**/tsconfig*.json",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // Basic rules - TypeScript compiler handles type checking
      "no-unused-vars": "off", // TypeScript handles this
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
]);
