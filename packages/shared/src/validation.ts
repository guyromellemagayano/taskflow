/**
 * @file validation.ts
 * @author Guy Romelle Magayano
 * @description Shared Zod validation schemas that mirror backend Pydantic models
 */

import { z } from "zod";

/** Login schema */
export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** Refresh token schema */
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/** Task status schema */
export const TaskStatusSchema = z.enum(["todo", "in_progress", "done"]);

/** Task priority schema */
export const TaskPrioritySchema = z.enum(["low", "medium", "high"]);

/** Date validation regex for YYYY-MM-DD format */
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/** Create task schema */
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

/** Update task schema */
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

/** Register user schema */
export const RegisterUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** Login input type */
export type LoginInput = z.infer<typeof LoginSchema>;

/** Refresh token input type */
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

/** Create task input type */
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

/** Update task input type */
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

/** Register user input type */
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
