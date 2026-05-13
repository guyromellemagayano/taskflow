import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskLoadingState } from "./TaskLoadingState";

describe("TaskLoadingState", () => {
  it("renders an accessible loading state", () => {
    render(<TaskLoadingState />);

    expect(
      screen.getByRole("status", { name: "Loading tasks" })
    ).toBeInTheDocument();
  });
});
