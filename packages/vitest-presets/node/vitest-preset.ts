/**
 * Node environment Vitest preset for Node.js testing
 * Use this preset for testing Node.js scripts and utilities
 */
const nodePreset = {
  test: {
    environment: "node",
    globals: true,
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
        "**/__tests__/**",
        "**/*.test.*",
        "**/*.spec.*",
        "**/mocks/**",
        "**/fixtures/**",
        "**/types/**",
        "**/__mocks__/**",
      ],
      include: [
        "src/**/*.{js,ts}",
        "!src/**/*.{test,spec}.{js,ts}",
        "!src/**/test-setup.*",
      ],
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache", "**/*.d.ts"],
  },
};

export default nodePreset;
