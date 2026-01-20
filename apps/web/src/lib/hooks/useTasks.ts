/** Custom hook for task management with filtering, sorting, and pagination */

import { useCallback, useMemo } from "react";

import { useMutation, useQuery } from "@apollo/client/react";

import {
  CREATE_TASK_MUTATION,
  type CreateTaskInput,
  DELETE_TASK_MUTATION,
  GET_TASKS_QUERY,
  type Task,
  type TaskFilters,
  UPDATE_TASK_MUTATION,
  type UpdateTaskInput,
} from "@web/lib/graphql/tasks";

const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_ORDER = "desc";
const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;
const OPTIMISTIC_ID_PREFIX = "temp-";

const ERROR_MESSAGES = {
  createFailed: "Failed to create task",
  updateFailed: "Failed to update task",
} as const;

const DEFAULT_STATUS = "todo";
const DEFAULT_PRIORITY = "low";
const TASK_TYPENAME = "Task";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: Error | undefined;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  refetch: () => void;
  loadMore: (newOffset: number) => Promise<void>;
}

interface UseTasksOptions {
  filters?: TaskFilters;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

interface GetTasksQueryData {
  tasks: Task[];
}

interface CreateTaskMutationData {
  createTask: Task;
}

interface UpdateTaskMutationData {
  updateTask: Task;
}

interface DeleteTaskMutationData {
  deleteTask: boolean;
}

// Custom hook for task management with filtering, sorting, and pagination
export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const {
    filters,
    sortBy = DEFAULT_SORT_BY,
    sortOrder = DEFAULT_SORT_ORDER,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    enabled = true,
  } = options;

  // Query tasks
  const { data, loading, error, refetch, fetchMore } =
    useQuery<GetTasksQueryData>(GET_TASKS_QUERY, {
      variables: {
        filters: filters || null,
        sortBy,
        sortOrder,
        limit,
        offset,
      },
      skip: !enabled,
      fetchPolicy: "network-only", // Always fetch fresh data
      errorPolicy: "all",
    });

  const tasks: Task[] = useMemo(() => data?.tasks || [], [data]);

  // Create task mutation using cache updates instead of refetch
  const [createTaskMutation, { loading: creating }] =
    useMutation<CreateTaskMutationData>(CREATE_TASK_MUTATION);

  // Update task mutation using cache updates instead of refetch
  const [updateTaskMutation, { loading: updating }] =
    useMutation<UpdateTaskMutationData>(UPDATE_TASK_MUTATION);

  // Delete task mutation using cache updates instead of refetch
  const [deleteTaskMutation, { loading: deleting }] =
    useMutation<DeleteTaskMutationData>(DELETE_TASK_MUTATION);

  // Create task handler
  const createTask = useCallback(
    async (input: CreateTaskInput): Promise<Task> => {
      // Ensure `dueDate` is a string (should already be from `TaskForm`, but normalize just in case)
      // Handle case where `dueDate` might accidentally be a Date object
      const normalizedInput: CreateTaskInput = {
        ...input,
        dueDate:
          typeof input.dueDate === "string"
            ? input.dueDate
            : input.dueDate
              ? String(input.dueDate)
              : null,
      };

      const now = new Date().toISOString();

      // Create task mutation
      const result = await createTaskMutation({
        variables: { input: normalizedInput },
        optimisticResponse: {
          createTask: {
            __typename: TASK_TYPENAME,
            id: `${OPTIMISTIC_ID_PREFIX}${Date.now()}`,
            title: normalizedInput.title,
            description: normalizedInput.description || null,
            status: normalizedInput.status || DEFAULT_STATUS,
            priority: normalizedInput.priority || DEFAULT_PRIORITY,
            dueDate: normalizedInput.dueDate || null,
            userId: "", // Will be set by server
            createdAt: now,
            updatedAt: now,
          },
        },
        // Update cache directly instead of refetching
        update: (cache, { data }) => {
          if (!data?.createTask) {
            return;
          }

          // Read current tasks from cache
          const existingData = cache.readQuery<{ tasks: Task[] }>({
            query: GET_TASKS_QUERY,
            variables: { filters, sortBy, sortOrder, limit, offset },
          });

          if (existingData) {
            // Write updated tasks to cache
            cache.writeQuery({
              query: GET_TASKS_QUERY,
              variables: { filters, sortBy, sortOrder, limit, offset },
              data: {
                tasks: [data.createTask, ...existingData.tasks],
              },
            });
          }
        },
      });

      if (!result.data?.createTask) {
        throw new Error(ERROR_MESSAGES.createFailed);
      }

      return result.data.createTask;
    },
    [createTaskMutation, filters, sortBy, sortOrder, limit, offset]
  );

  // Update task handler
  const updateTask = useCallback(
    async (input: UpdateTaskInput): Promise<Task> => {
      // Ensure `dueDate` is a string (should already be from `TaskForm`, but normalize just in case)
      // Handle case where `dueDate` might accidentally be a Date object
      const normalizedInput: UpdateTaskInput = {
        ...input,
        dueDate:
          typeof input.dueDate === "string"
            ? input.dueDate
            : input.dueDate
              ? String(input.dueDate)
              : null,
      };

      const result = await updateTaskMutation({
        variables: { input: normalizedInput },
        // Update cache directly instead of refetching
        update: (cache, { data }) => {
          if (!data?.updateTask) {
            return;
          }

          // Read current tasks from cache
          const existingData = cache.readQuery<{ tasks: Task[] }>({
            query: GET_TASKS_QUERY,
            variables: { filters, sortBy, sortOrder, limit, offset },
          });

          if (existingData) {
            // Update the task in the cache
            const updatedTasks = existingData.tasks.map((task) =>
              task.id === data.updateTask.id ? data.updateTask : task
            );

            cache.writeQuery({
              query: GET_TASKS_QUERY,
              variables: { filters, sortBy, sortOrder, limit, offset },
              data: {
                tasks: updatedTasks,
              },
            });
          }
        },
      });

      if (!result.data?.updateTask) {
        throw new Error(ERROR_MESSAGES.updateFailed);
      }

      return result.data.updateTask;
    },
    [updateTaskMutation, filters, sortBy, sortOrder, limit, offset]
  );

  // Delete task handler
  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await deleteTaskMutation({
        variables: { id },
        optimisticResponse: {
          deleteTask: true,
        },
        // Update cache directly instead of refetching
        update: (cache) => {
          // Read current tasks from cache
          const existingData = cache.readQuery<{ tasks: Task[] }>({
            query: GET_TASKS_QUERY,
            variables: { filters, sortBy, sortOrder, limit, offset },
          });

          if (existingData) {
            // Remove deleted task from cache
            const filteredTasks = existingData.tasks.filter(
              (task) => task.id !== id
            );

            cache.writeQuery({
              query: GET_TASKS_QUERY,
              variables: { filters, sortBy, sortOrder, limit, offset },
              data: {
                tasks: filteredTasks,
              },
            });
          }
        },
      });

      return result.data?.deleteTask ?? false;
    },
    [deleteTaskMutation, filters, sortBy, sortOrder, limit, offset]
  );

  // Load more tasks handler
  const loadMore = useCallback(
    async (newOffset: number) => {
      await fetchMore<GetTasksQueryData>({
        variables: {
          offset: newOffset,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return {
            tasks: [...prev.tasks, ...fetchMoreResult.tasks],
          };
        },
      });
    },
    [fetchMore]
  );

  return {
    tasks,
    loading,
    error,
    creating,
    updating,
    deleting,
    createTask,
    updateTask,
    deleteTask,
    refetch,
    loadMore,
  };
}
