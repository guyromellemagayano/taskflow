/**
 * @file tasks.ts
 * @author Guy Romelle Magayano
 * @description GraphQL queries and mutations for tasks
 */

import { gql } from "@apollo/client";

import type {
  CreateTaskInput as SharedCreateTaskInput,
  Task as SharedTask,
  TaskFilters as SharedTaskFilters,
  UpdateTaskInput as SharedUpdateTaskInput,
} from "@taskflow/shared";

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
      tasks {
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
      total
      limit
      offset
      hasMore
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
export interface Task extends SharedTask {
  __typename?: "Task";
}

/** Paginated task list response */
export interface TasksConnection {
  __typename?: "TasksConnection";
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/** Task filters */
export interface TaskFilters extends SharedTaskFilters {}

/** Create task input */
export type CreateTaskInput = SharedCreateTaskInput;

/** Update task input */
export type UpdateTaskInput = SharedUpdateTaskInput;
