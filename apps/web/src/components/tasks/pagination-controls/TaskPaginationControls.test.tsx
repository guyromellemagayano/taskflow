import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskPaginationControls } from "./TaskPaginationControls";

describe("TaskPaginationControls", () => {
  it("renders the current page summary and page counts", () => {
    render(
      <TaskPaginationControls
        page={2}
        pageSize={20}
        total={43}
        hasMore
        loading={false}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText("Showing 21-40 of 43 tasks")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("invokes page changes for previous and next buttons", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <TaskPaginationControls
        page={2}
        pageSize={20}
        total={43}
        hasMore
        loading={false}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Previous" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("hides controls when a single page is enough", () => {
    const { container } = render(
      <TaskPaginationControls
        page={1}
        pageSize={20}
        total={20}
        hasMore={false}
        loading={false}
        onPageChange={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
