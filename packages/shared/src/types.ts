/**
 * @file types.ts
 * @author Guy Romelle Magayano
 * @description Shared TypeScript types for TaskFlow
 */

/** Task status type */
export type TaskStatus = "todo" | "in_progress" | "done";

/** Task priority type */
export type TaskPriority = "low" | "medium" | "high";

/** Task sort order */
export type SortOrder = "asc" | "desc";

/** Task type */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** User type */
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

/** Auth payload type */
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Task filters */
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
}

/** Create task input */
export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

/** Update task input */
export interface UpdateTaskInput {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}
