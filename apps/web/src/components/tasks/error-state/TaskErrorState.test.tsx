import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskErrorState } from "./TaskErrorState";

describe("TaskErrorState", () => {
  it("renders the provided error message", () => {
    render(<TaskErrorState error={new Error("Network failed")} />);

    expect(screen.getByText("Network failed")).toBeInTheDocument();
  });

  it("falls back to the default message when the error is empty", () => {
    render(<TaskErrorState error={new Error("")} />);

    expect(screen.getByText("Failed to load tasks")).toBeInTheDocument();
  });
});
