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
  type TasksConnection,
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
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  loading: boolean;
  error: Error | undefined;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  refetch: () => Promise<unknown>;
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
  tasks: TasksConnection;
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

  const queryVariables = useMemo(
    () => ({
      filters: filters || null,
      sortBy,
      sortOrder,
      limit,
      offset,
    }),
    [filters, sortBy, sortOrder, limit, offset]
  );

  // Query tasks
  const { data, loading, error, refetch } = useQuery<GetTasksQueryData>(
    GET_TASKS_QUERY,
    {
      variables: queryVariables,
      skip: !enabled,
      fetchPolicy: "network-only", // Always fetch fresh data
      errorPolicy: "all",
    }
  );

  const connection = useMemo(() => data?.tasks ?? null, [data]);
  const tasks: Task[] = useMemo(() => connection?.tasks ?? [], [connection]);
  const total = connection?.total ?? 0;
  const hasMore = connection?.hasMore ?? false;

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

          const existingData = cache.readQuery<GetTasksQueryData>({
            query: GET_TASKS_QUERY,
            variables: queryVariables,
          });

          if (existingData?.tasks) {
            const nextTotal = existingData.tasks.total + 1;
            const nextTasks =
              offset === DEFAULT_OFFSET
                ? [
                    data.createTask,
                    ...existingData.tasks.tasks.filter(
                      (task) => task.id !== data.createTask.id
                    ),
                  ].slice(0, limit)
                : existingData.tasks.tasks;

            cache.writeQuery({
              query: GET_TASKS_QUERY,
              variables: queryVariables,
              data: {
                tasks: {
                  ...existingData.tasks,
                  tasks: nextTasks,
                  total: nextTotal,
                  hasMore: offset + nextTasks.length < nextTotal,
                },
              },
            });
          }
        },
        refetchQueries: [{ query: GET_TASKS_QUERY, variables: queryVariables }],
      });

      if (!result.data?.createTask) {
        throw new Error(ERROR_MESSAGES.createFailed);
      }

      return result.data.createTask;
    },
    [createTaskMutation, limit, offset, queryVariables]
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
          const existingData = cache.readQuery<GetTasksQueryData>({
            query: GET_TASKS_QUERY,
            variables: queryVariables,
          });

          if (existingData?.tasks) {
            const updatedTasks = existingData.tasks.tasks.map((task) =>
              task.id === data.updateTask.id ? data.updateTask : task
            );

            cache.writeQuery({
              query: GET_TASKS_QUERY,
              variables: queryVariables,
              data: {
                tasks: {
                  ...existingData.tasks,
                  tasks: updatedTasks,
                },
              },
            });
          }
        },
        refetchQueries: [{ query: GET_TASKS_QUERY, variables: queryVariables }],
      });

      if (!result.data?.updateTask) {
        throw new Error(ERROR_MESSAGES.updateFailed);
      }

      return result.data.updateTask;
    },
    [queryVariables, updateTaskMutation]
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
          const existingData = cache.readQuery<GetTasksQueryData>({
            query: GET_TASKS_QUERY,
            variables: queryVariables,
          });

          if (existingData?.tasks) {
            const filteredTasks = existingData.tasks.tasks.filter(
              (task) => task.id !== id
            );
            const nextTotal = Math.max(existingData.tasks.total - 1, 0);

            cache.writeQuery({
              query: GET_TASKS_QUERY,
              variables: queryVariables,
              data: {
                tasks: {
                  ...existingData.tasks,
                  tasks: filteredTasks,
                  total: nextTotal,
                  hasMore: offset + filteredTasks.length < nextTotal,
                },
              },
            });
          }
        },
        refetchQueries: [{ query: GET_TASKS_QUERY, variables: queryVariables }],
      });

      return result.data?.deleteTask ?? false;
    },
    [deleteTaskMutation, offset, queryVariables]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    tasks,
    total,
    limit,
    offset,
    hasMore,
    loading,
    error,
    creating,
    updating,
    deleting,
    createTask,
    updateTask,
    deleteTask,
    refetch: handleRefetch,
  };
}
