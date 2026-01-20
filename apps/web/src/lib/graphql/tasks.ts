/**
 * @file tasks.ts
 * @author Guy Romelle Magayano
 * @description GraphQL queries and mutations for tasks
 */

import { gql } from "@apollo/client";

/** Get tasks query with filters, sorting, and pagination */
export const GET_TASKS_QUERY = gql`
  query GetTasks(
    $filters: TaskFilters
    $sortBy: String
    $sortOrder: String
    $limit: Int
    $offset: Int
  ) {
    tasks(
      filters: $filters
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
      offset: $offset
    ) {
      id
      title
      description
      status
      priority
      dueDate
      userId
      createdAt
      updatedAt
    }
  }
`;

/** Get single task by ID */
export const GET_TASK_QUERY = gql`
  query GetTask($id: String!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      dueDate
      userId
      createdAt
      updatedAt
    }
  }
`;

/** Create task mutation */
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      userId
      createdAt
      updatedAt
    }
  }
`;

/** Update task mutation */
export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      userId
      createdAt
      updatedAt
    }
  }
`;

/** Delete task mutation */
export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id)
  }
`;

/** Task type definitions */
export interface Task {
  __typename?: "Task";
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** Task filters */
export interface TaskFilters {
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate_from?: string;
  dueDate_to?: string;
  search?: string;
}

/** Create task input */
export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
}

/** Update task input */
export interface UpdateTaskInput {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
}
