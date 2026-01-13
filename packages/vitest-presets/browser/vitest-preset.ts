/**
 * Browser environment Vitest preset for DOM testing
 * Use this preset for testing components that need a browser environment
 */
const browserPreset = {
  test: {
    environment: "jsdom",
    setupFiles: ["@taskflow/vitest-presets/shared/test-setup.ts"],
    globals: true,
    css: true,
    coverage: {
      provider: "v8" as const,
      reporter: ["text", "json", "html", "lcov", "clover"],
      reportOnFailure: true,
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
      exclude: [
        "node_modules/",
        "dist/",
        "build/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/test-setup.*",
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.stories.*",
        "**/mocks/**",
        "**/fixtures/**",
        "**/types/**",
        "**/__mocks__/**",
      ],
      include: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.{test,spec}.{js,jsx,ts,tsx}",
        "!src/**/test-setup.*",
      ],
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      ".idea",
      ".git",
      ".cache",
      "**/*.d.ts",
      "**/*.stories.*",
    ],
  },
};

export default browserPreset;
