import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskList } from "./TaskList";

const baseTask = {
  id: "task-1",
  title: "Ship smoke coverage",
  description: "Add the first browser suite",
  status: "todo" as const,
  priority: "medium" as const,
  dueDate: null,
  userId: "user-1",
  createdAt: "2026-05-12T00:00:00.000Z",
  updatedAt: "2026-05-12T00:00:00.000Z",
};

describe("TaskList", () => {
  it("renders skeleton placeholders while tasks are not yet loaded", () => {
    render(
      <TaskList
        tasks={undefined as unknown as (typeof baseTask)[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
        updating={false}
      />
    );

    expect(screen.getAllByTestId("mantine-skeleton")).toHaveLength(3);
  });

  it("returns null when there are no tasks", () => {
    const { container } = render(
      <TaskList
        tasks={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
        updating={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("forwards callbacks through rendered task items", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <TaskList
        tasks={[baseTask]}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        updating={false}
      />
    );

    expect(screen.getByText("Ship smoke coverage")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Start task" }));

    expect(onEdit).toHaveBeenCalledWith(baseTask);
    expect(onDelete).toHaveBeenCalledWith("task-1");
    expect(onStatusChange).toHaveBeenCalledWith(baseTask, "in_progress");
  });
});
