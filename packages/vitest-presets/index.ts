/**
 * @taskflow/vitest-presets
 *
 * Shared Vitest configuration presets for the monorepo.
 */

// Presets
export { browserPreset } from "./browser/index.js";
export { nodePreset } from "./node/index.js";
export { reactPreset } from "./react/index.js";

// Note: test-setup.ts should be imported directly in vitest.config.ts setupFiles
// Do not import it here as it will execute during config loading
