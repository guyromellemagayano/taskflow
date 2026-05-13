import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskPageHeader } from "./TaskPageHeader";

describe("TaskPageHeader", () => {
  it("renders the page heading and triggers the new-task action", async () => {
    const user = userEvent.setup();
    const onNewTaskClick = vi.fn();

    render(<TaskPageHeader onNewTaskClick={onNewTaskClick} />);

    expect(
      screen.getByRole("heading", { name: "My Tasks" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "New Task" }));

    expect(onNewTaskClick).toHaveBeenCalledTimes(1);
  });
});
