import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Enforce function declarations for all exported functions, components, and hooks
      // This ensures better stack traces, React DevTools support, and consistency
      // Arrow functions are still allowed for callbacks and inline functions
      "func-style": [
        "error",
        "declaration",
        {
          allowArrowFunctions: true, // Allow arrow functions for callbacks/inline functions
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
