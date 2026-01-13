/**
 * Shared test setup barrel export
 *
 * Note: test-setup.ts is a side-effect file that sets up mocks and global configurations.
 * It doesn't export anything by default, but we re-export it for convenience.
 *
 * IMPORTANT: Do not import test-setup.ts here as it will execute during config loading.
 * test-setup.ts should only be imported via setupFiles in vitest config.
 */

// Since test-setup.ts doesn't export anything, we export a placeholder
// The actual test-setup.ts file should be imported directly in vitest.config.ts setupFiles
export const testSetup = true;
