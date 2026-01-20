/**
 * @file tasks.ts
 * @author Guy Romelle Magayano
 * @description Task-related constants for UI components
 */

/** Status color mappings for task badges */
export const STATUS_COLORS = {
  todo: "gray",
  in_progress: "blue",
  done: "green",
} as const;

/** Priority color mappings for task badges */
export const PRIORITY_COLORS = {
  low: "gray",
  medium: "yellow",
  high: "red",
} as const;

/** Status options for `Select` components */
export const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
] as const;

/** Priority options for `Select` components */
export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;
