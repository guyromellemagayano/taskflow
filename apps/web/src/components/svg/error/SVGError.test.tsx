import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SVGError } from "./SVGError";

describe("SVGError", () => {
  it("renders the error svg with forwarded props", () => {
    const { container } = render(
      <SVGError className="taskflow-error-icon" aria-hidden="true" />
    );

    const svg = container.querySelector("svg");
    const path = container.querySelector("path");

    expect(svg).toHaveAttribute("viewBox", "0 0 362 145");
    expect(svg).toHaveClass("taskflow-error-icon");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(path).not.toBeNull();
  });
});
