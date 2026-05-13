/**
 * @file useTaskFilters.ts
 * @author Guy Romelle Magayano
 * @description Custom hook for parsing task filters from URL search params
 */

import { useMemo } from "react";

import { useSearchParams } from "next/navigation";

import type { TaskFilters } from "@web/lib/graphql/tasks";

interface UseTaskFiltersReturn {
  filters: TaskFilters;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
  offset: number;
}

const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_ORDER = "desc" as const;
export const TASKS_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;

// Custom hook for parsing task filters from URL search params
export function useTaskFilters(): UseTaskFiltersReturn {
  const searchParams = useSearchParams();

  // Get filter/sort params from URL
  const statusFilter = searchParams.get("status") || undefined;
  const priorityFilter = searchParams.get("priority") || undefined;
  const searchQuery = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || DEFAULT_SORT_BY;
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") || DEFAULT_SORT_ORDER;
  const pageParam = Number(searchParams.get("page") || DEFAULT_PAGE);
  const page =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : DEFAULT_PAGE;
  const offset = (page - 1) * TASKS_PAGE_SIZE;

  // Memoize filters object to avoid recreation on every render
  const filters: TaskFilters = useMemo(
    () => ({
      status: statusFilter as TaskFilters["status"],
      priority: priorityFilter as TaskFilters["priority"],
      search: searchQuery,
    }),
    [statusFilter, priorityFilter, searchQuery]
  );

  return {
    filters,
    sortBy,
    sortOrder,
    page,
    limit: TASKS_PAGE_SIZE,
    offset,
  };
}
