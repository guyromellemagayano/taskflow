import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskCard } from "./TaskCard";

const baseTask = {
  id: "task-1",
  title: "Write release notes",
  description: "Summarize the latest hardening work",
  status: "todo" as const,
  priority: "high" as const,
  dueDate: "2026-05-31",
  userId: "user-1",
  createdAt: "2026-05-12T00:00:00.000Z",
  updatedAt: "2026-05-12T00:00:00.000Z",
};

describe("TaskCard", () => {
  it("renders metadata and forwards actions for todo tasks", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <TaskCard
        task={baseTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        updating={false}
      />
    );

    expect(
      screen.getByRole("link", { name: "Write release notes" })
    ).toHaveAttribute("href", "/tasks/task-1");
    expect(
      screen.getByText("Summarize the latest hardening work")
    ).toBeInTheDocument();
    expect(screen.getByText("todo")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(
      screen.getByText(
        `Due: ${new Date("2026-05-31T00:00:00").toLocaleDateString()}`
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Mark task as done" }));
    await user.click(screen.getByRole("button", { name: "Start task" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onStatusChange).toHaveBeenNthCalledWith(1, "done");
    expect(onStatusChange).toHaveBeenNthCalledWith(2, "in_progress");
  });

  it("shows the revert action for in-progress tasks", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <TaskCard
        task={{ ...baseTask, status: "in_progress", priority: "medium" }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={onStatusChange}
        updating={false}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Start task" })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Move task back to todo" })
    );

    expect(onStatusChange).toHaveBeenCalledWith("todo");
  });
});
