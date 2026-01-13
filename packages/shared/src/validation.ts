/**
 * @taskflow/shared/validation
 *
 * Shared Zod validation schemas that mirror backend Pydantic models
 */

import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Task schemas
export const TaskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const TaskPrioritySchema = z.enum(["low", "medium", "high"]);

// Date validation regex for YYYY-MM-DD format
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z
    .string()
    .max(5000, "Description too long")
    .optional()
    .nullable(),
  priority: TaskPrioritySchema.default("medium"),
  dueDate: z
    .string()
    .regex(dateRegex, "Invalid date format. Expected YYYY-MM-DD format.")
    .optional()
    .nullable(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dueDate: z
    .string()
    .regex(dateRegex, "Invalid date format. Expected YYYY-MM-DD format.")
    .optional()
    .nullable(),
});

// User schemas (for future use)
export const RegisterUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
