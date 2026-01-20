/**
 * @file useTaskActions.ts
 * @author Guy Romelle Magayano
 * @description Custom hook for task action handlers (create, update, delete, status change)
 */

import { useCallback } from "react";

import { modals } from "@mantine/modals";

import {
  type CreateTaskInput,
  type Task,
  type UpdateTaskInput,
} from "@web/lib/graphql/tasks";
import { extractErrorMessage } from "@web/lib/utils/apollo";

import { useToast } from "./useToast";

const SUCCESS_MESSAGES = {
  created: "Task created successfully",
  updated: "Task updated successfully",
  deleted: "Task deleted successfully",
  statusUpdated: "Task status updated",
} as const;

const DELETE_MODAL_CONFIG = {
  title: "Delete Task",
  children:
    "Are you sure you want to delete this task? This action cannot be undone.",
  labels: { confirm: "Delete", cancel: "Cancel" },
  confirmProps: { color: "red" as const },
} as const;

interface UseTaskActionsOptions {
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  onTaskCreated?: () => void;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
  onStatusChanged?: () => void;
}

interface UseTaskActionsReturn {
  handleCreate: (input: CreateTaskInput) => Promise<void>;
  handleUpdate: (input: UpdateTaskInput) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleStatusChange: (task: Task, newStatus: Task["status"]) => Promise<void>;
}

export function useTaskActions(
  props: UseTaskActionsOptions
): UseTaskActionsReturn {
  const {
    createTask,
    updateTask,
    deleteTask,
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onStatusChanged,
  } = props;

  const { showSuccess, showError } = useToast();

  // Create task handler
  const handleCreate = useCallback(
    async (input: CreateTaskInput) => {
      try {
        await createTask(input);
        onTaskCreated?.();
        showSuccess(SUCCESS_MESSAGES.created);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        showError(errorMessage);
        throw err;
      }
    },
    [createTask, onTaskCreated, showSuccess, showError]
  );

  // Update task handler
  const handleUpdate = useCallback(
    async (input: UpdateTaskInput) => {
      try {
        await updateTask(input);
        onTaskUpdated?.();
        showSuccess(SUCCESS_MESSAGES.updated);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        showError(errorMessage);
        throw err;
      }
    },
    [updateTask, onTaskUpdated, showSuccess, showError]
  );

  // Delete task handler
  const handleDelete = useCallback(
    async (id: string) => {
      modals.openConfirmModal({
        ...DELETE_MODAL_CONFIG,
        onConfirm: async () => {
          try {
            await deleteTask(id);
            onTaskDeleted?.();
            showSuccess(SUCCESS_MESSAGES.deleted);
          } catch (err) {
            const errorMessage = extractErrorMessage(err);
            showError(errorMessage);
          }
        },
      });
    },
    [deleteTask, onTaskDeleted, showSuccess, showError]
  );

  // Status change handler
  const handleStatusChange = useCallback(
    async (task: Task, newStatus: Task["status"]) => {
      try {
        await updateTask({
          id: task.id,
          status: newStatus,
        });
        onStatusChanged?.();
        showSuccess(SUCCESS_MESSAGES.statusUpdated);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        showError(errorMessage);
      }
    },
    [updateTask, onStatusChanged, showSuccess, showError]
  );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
  };
}
