import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskDetailView } from "./TaskDetailView";

const task = {
  id: "task-1",
  title: "Refine pagination truth",
  description: "Move the task list onto a real connection contract.",
  status: "in_progress" as const,
  priority: "high" as const,
  dueDate: "2026-05-20",
  userId: "user-1",
  createdAt: "2026-05-13T02:30:00.000Z",
  updatedAt: "2026-05-13T04:45:00.000Z",
};

describe("TaskDetailView", () => {
  it("renders the task summary and workspace links", () => {
    render(<TaskDetailView task={task} />);

    expect(
      screen.getByRole("heading", { name: "Refine pagination truth" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Move the task list onto a real connection contract.")
    ).toBeInTheDocument();
    expect(screen.getByText(/Due /)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to tasks" })).toHaveAttribute(
      "href",
      "/tasks"
    );
    expect(
      screen.getByRole("link", { name: "Manage in workspace" })
    ).toHaveAttribute("href", "/tasks");
  });

  it("falls back gracefully when the task has no description or due date", () => {
    render(
      <TaskDetailView
        task={{
          ...task,
          description: null,
          dueDate: null,
        }}
      />
    );

    expect(screen.getByText("No description provided.")).toBeInTheDocument();
    expect(screen.getByText("No due date set.")).toBeInTheDocument();
  });
});
