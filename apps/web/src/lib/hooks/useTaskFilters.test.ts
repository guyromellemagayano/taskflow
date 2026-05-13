import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TASKS_PAGE_SIZE, useTaskFilters } from "./useTaskFilters";

describe("useTaskFilters", () => {
  it("returns defaults when the URL does not define pagination", () => {
    const { result } = renderHook(() => useTaskFilters());

    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(TASKS_PAGE_SIZE);
    expect(result.current.offset).toBe(0);
  });

  it("normalizes invalid page params and computes offset", () => {
    (
      globalThis as typeof globalThis & { __TEST_SEARCH_PARAMS__?: string }
    ).__TEST_SEARCH_PARAMS__ = "page=3&status=todo";

    const { result, rerender } = renderHook(() => useTaskFilters());

    expect(result.current.page).toBe(3);
    expect(result.current.offset).toBe(40);
    expect(result.current.filters.status).toBe("todo");

    (
      globalThis as typeof globalThis & { __TEST_SEARCH_PARAMS__?: string }
    ).__TEST_SEARCH_PARAMS__ = "page=-4";

    rerender();

    expect(result.current.page).toBe(1);
    expect(result.current.offset).toBe(0);
  });
});
