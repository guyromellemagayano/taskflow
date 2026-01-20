/**
 * @file types.ts
 * @author Guy Romelle Magayano
 * @description Shared TypeScript types for TaskFlow
 */

/** Task status type */
export type TaskStatus = "todo" | "in_progress" | "done";

/** Task priority type */
export type TaskPriority = "low" | "medium" | "high";

/** Task type */
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** User type */
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/** Auth payload type */
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}
