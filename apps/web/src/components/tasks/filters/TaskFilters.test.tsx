import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TaskFilters } from "./TaskFilters";

const mockPush = (
  globalThis as typeof globalThis & {
    __MOCK_ROUTER_PUSH__: ReturnType<typeof vi.fn>;
    __TEST_SEARCH_PARAMS__?: string;
  }
).__MOCK_ROUTER_PUSH__;

describe("TaskFilters", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("syncs state from the URL and clears active filters", async () => {
    const user = userEvent.setup();
    (
      globalThis as typeof globalThis & { __TEST_SEARCH_PARAMS__?: string }
    ).__TEST_SEARCH_PARAMS__ =
      "status=todo&priority=high&search=urgent&sortBy=title&sortOrder=asc";

    render(<TaskFilters />);

    expect(screen.getByDisplayValue("urgent")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toHaveValue("todo");
    expect(screen.getByLabelText("Priority")).toHaveValue("high");
    expect(screen.getByLabelText("Sort By")).toHaveValue("title");
    expect(screen.getByLabelText("Order")).toHaveValue("asc");

    await user.click(screen.getByRole("button", { name: /clear/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/tasks");
    });
  });

  it("pushes updated URL params when a filter changes", async () => {
    const user = userEvent.setup();
    (
      globalThis as typeof globalThis & { __TEST_SEARCH_PARAMS__?: string }
    ).__TEST_SEARCH_PARAMS__ = "page=3&priority=medium&search=backlog";

    render(<TaskFilters />);

    await user.selectOptions(screen.getByLabelText("Status"), "done");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });

    const lastPush = mockPush.mock.lastCall?.[0] as string;
    expect(lastPush).toContain("/tasks?");
    expect(lastPush).toContain("status=done");
    expect(lastPush).toContain("priority=medium");
    expect(lastPush).toContain("search=backlog");
    expect(lastPush).not.toContain("page=");
  });
});
