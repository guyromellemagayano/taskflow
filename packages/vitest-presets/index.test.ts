import { describe, expect, it } from "vitest";

import { browserPreset, nodePreset, reactPreset } from "./index";
import { testSetup } from "./shared";

describe("@taskflow/vitest-presets", () => {
  it("exports the shared setup placeholder", () => {
    expect(testSetup).toBe(true);
  });

  it("provides a node preset with the expected runtime defaults", () => {
    expect(nodePreset.test.environment).toBe("node");
    expect(nodePreset.test.globals).toBe(true);
    expect(nodePreset.test.coverage.provider).toBe("v8");
  });

  it("provides browser-oriented presets with DOM setup files", () => {
    expect(browserPreset.test.environment).toBe("jsdom");
    expect(reactPreset.test.environment).toBe("jsdom");
    expect(browserPreset.test.setupFiles).toContain(
      "@taskflow/vitest-presets/shared/test-setup.ts"
    );
    expect(reactPreset.test.setupFiles).toContain(
      "@taskflow/vitest-presets/shared/test-setup.ts"
    );
  });
});
