import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskEmptyState } from "./TaskEmptyState";

describe("TaskEmptyState", () => {
  it("renders the empty state message", () => {
    render(<TaskEmptyState />);

    expect(
      screen.getByText("No tasks found. Create your first task to get started!")
    ).toBeInTheDocument();
  });
});
