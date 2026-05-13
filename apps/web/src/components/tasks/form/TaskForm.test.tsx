import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskForm } from "./TaskForm";

describe("TaskForm", () => {
  it("submits normalized create input and resets after success", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText("Title"), "Prepare release");
    await user.type(
      screen.getByLabelText("Description"),
      "Document the latest verification pass"
    );
    await user.selectOptions(screen.getByLabelText("Status"), "done");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2026-05-30" },
    });

    await user.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Prepare release",
        description: "Document the latest verification pass",
        status: "done",
        priority: "high",
        dueDate: "2026-05-30",
      });
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toHaveValue("");
    });
  });

  it("prefills edit values and lets the user cancel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <TaskForm
        task={{
          id: "task-2",
          title: "Follow up",
          description: "Refine the migration slice",
          status: "in_progress",
          priority: "medium",
          dueDate: "2026-06-01",
          userId: "user-1",
          createdAt: "2026-05-12T00:00:00.000Z",
          updatedAt: "2026-05-12T00:00:00.000Z",
        }}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />
    );

    expect(screen.getByDisplayValue("Follow up")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Refine the migration slice")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toHaveValue("in_progress");
    expect(
      screen.getByRole("button", { name: "Update Task" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
