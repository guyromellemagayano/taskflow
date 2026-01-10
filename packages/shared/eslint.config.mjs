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
      // Enforce function declarations for all exported functions
      // Arrow functions are allowed for callbacks/inline functions
      "func-style": [
        "error",
        "declaration",
        {
          allowArrowFunctions: true,
        },
      ],
    },
  },
]);
