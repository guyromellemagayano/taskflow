/**
 * @file TaskFilters.tsx
 * @author Guy Romelle Magayano
 * @description Task filters component with URL state sync
 */

"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useReducer,
  useRef,
  useTransition,
} from "react";

import { Button, Group, Paper, Select, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@web/lib/constants/tasks";

interface FilterState {
  status: string;
  priority: string;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

type FilterAction =
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_PRIORITY"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT_BY"; payload: string }
  | { type: "SET_SORT_ORDER"; payload: "asc" | "desc" }
  | { type: "SYNC_FROM_URL"; payload: FilterState }
  | { type: "RESET" };

const initialState: FilterState = {
  status: "",
  priority: "",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const SORT_BY_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
] as const;

const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
] as const;

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "SET_SORT_ORDER":
      return { ...state, sortOrder: action.payload };
    case "SYNC_FROM_URL":
      return action.payload;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isUpdatingURLRef = useRef(false);

  const statusParam = searchParams.get("status") || "";
  const priorityParam = searchParams.get("priority") || "";
  const searchParam = searchParams.get("search") || "";
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  const sortOrderParam =
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const [state, dispatch] = useReducer(filterReducer, {
    status: statusParam,
    priority: priorityParam,
    search: searchParam,
    sortBy: sortByParam,
    sortOrder: sortOrderParam,
  });

  useEffect(() => {
    if (isUpdatingURLRef.current) {
      isUpdatingURLRef.current = false;
      return;
    }

    const urlChanged =
      statusParam !== state.status ||
      priorityParam !== state.priority ||
      searchParam !== state.search ||
      sortByParam !== state.sortBy ||
      sortOrderParam !== state.sortOrder;

    if (urlChanged) {
      startTransition(() => {
        dispatch({
          type: "SYNC_FROM_URL",
          payload: {
            status: statusParam,
            priority: priorityParam,
            search: searchParam,
            sortBy: sortByParam,
            sortOrder: sortOrderParam,
          },
        });
      });
    }
  }, [
    statusParam,
    priorityParam,
    searchParam,
    sortByParam,
    sortOrderParam,
    state.status,
    state.priority,
    state.search,
    state.sortBy,
    state.sortOrder,
    startTransition,
  ]);

  // For search debouncing
  const deferredSearch = useDeferredValue(state.search);

  // Update URL when state changes
  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      isUpdatingURLRef.current = true;
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        router.push(`/tasks?${params.toString()}`);
      });
    },
    [searchParams, router, startTransition]
  );

  // Update URL when deferred search value changes
  useEffect(() => {
    if (deferredSearch === searchParam) {
      return;
    }

    isUpdatingURLRef.current = true;
    const params = new URLSearchParams(searchParams.toString());
    if (deferredSearch) {
      params.set("search", deferredSearch);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/tasks?${params.toString()}`);
    });
  }, [deferredSearch, searchParam, searchParams, router, startTransition]);

  const handleStatusChange = useCallback(
    (value: string | null) => {
      dispatch({ type: "SET_STATUS", payload: value || "" });
      updateURL({ status: value });
    },
    [updateURL]
  );

  const handlePriorityChange = useCallback(
    (value: string | null) => {
      dispatch({ type: "SET_PRIORITY", payload: value || "" });
      updateURL({ priority: value });
    },
    [updateURL]
  );

  const handleSearchChange = useCallback((value: string) => {
    dispatch({ type: "SET_SEARCH", payload: value });
  }, []);

  const handleSortByChange = useCallback(
    (value: string | null) => {
      const sortBy = value || "createdAt";
      dispatch({ type: "SET_SORT_BY", payload: sortBy });
      updateURL({ sortBy });
    },
    [updateURL]
  );

  const handleSortOrderChange = useCallback(
    (value: string | null) => {
      const sortOrder = (value || "desc") as "asc" | "desc";
      dispatch({ type: "SET_SORT_ORDER", payload: sortOrder });
      updateURL({ sortOrder });
    },
    [updateURL]
  );

  const clearFilters = useCallback(() => {
    dispatch({ type: "RESET" });
    isUpdatingURLRef.current = true;
    startTransition(() => {
      router.push("/tasks");
    });
  }, [router, startTransition]);

  const hasActiveFilters = Boolean(
    state.status || state.priority || state.search
  );

  return (
    <Paper p="md" mb="md" withBorder>
      <Group gap="md" align="flex-end">
        <TextInput
          placeholder="Search tasks..."
          value={state.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ flex: 1 }}
          disabled={isPending}
        />

        <Select
          label="Status"
          placeholder="All statuses"
          data={STATUS_OPTIONS}
          value={state.status || null}
          onChange={handleStatusChange}
          clearable
          disabled={isPending}
        />

        <Select
          label="Priority"
          placeholder="All priorities"
          data={PRIORITY_OPTIONS}
          value={state.priority || null}
          onChange={handlePriorityChange}
          clearable
          disabled={isPending}
        />

        <Select
          label="Sort By"
          data={SORT_BY_OPTIONS}
          value={state.sortBy}
          onChange={handleSortByChange}
          disabled={isPending}
        />

        <Select
          label="Order"
          data={SORT_ORDER_OPTIONS}
          value={state.sortOrder}
          onChange={handleSortOrderChange}
          disabled={isPending}
        />

        {hasActiveFilters ? (
          <Button
            variant="subtle"
            leftSection={<IconX size={16} />}
            onClick={clearFilters}
            disabled={isPending}
          >
            Clear
          </Button>
        ) : null}
      </Group>
    </Paper>
  );
}
