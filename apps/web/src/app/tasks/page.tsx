/**
 * @file page.tsx
 * @author Guy Romelle Magayano
 * @description Task list page with filtering, sorting, and pagination
 */

"use client";

import { Suspense, useState } from "react";

import { Container, Loader, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";

import { TaskEmptyState } from "@web/components/tasks/empty-state/TaskEmptyState";
import { TaskErrorState } from "@web/components/tasks/error-state/TaskErrorState";
import { TaskFilters } from "@web/components/tasks/filters/TaskFilters";
import { TaskForm } from "@web/components/tasks/form/TaskForm";
import { TaskList } from "@web/components/tasks/list/TaskList";
import { TaskLoadingState } from "@web/components/tasks/loading-state/TaskLoadingState";
import { TaskPageHeader } from "@web/components/tasks/page-header/TaskPageHeader";
import { useAuth } from "@web/lib/auth/context";
import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "@web/lib/graphql/tasks";
import { useTaskActions } from "@web/lib/hooks/useTaskActions";
import { useTaskFilters } from "@web/lib/hooks/useTaskFilters";
import { useTasks } from "@web/lib/hooks/useTasks";

/** Tasks page content that uses search params - must be wrapped in Suspense */
function TasksPageContent() {
  const { user } = useAuth();
  const router = useRouter();

  // Get filters and sort params from URL
  const { filters, sortBy, sortOrder } = useTaskFilters();

  // Task management
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    creating,
    updating,
    deleting,
  } = useTasks({
    filters,
    sortBy,
    sortOrder,
    limit: 50,
    offset: 0,
    enabled: Boolean(user),
  });

  // UI state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Task action handlers
  const { handleCreate, handleUpdate, handleDelete, handleStatusChange } =
    useTaskActions({
      createTask,
      updateTask,
      deleteTask,
      onTaskCreated: () => setShowCreateForm(false),
      onTaskUpdated: () => setEditingTask(null),
    });

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <TaskPageHeader onNewTaskClick={() => setShowCreateForm(true)} />
      <Suspense fallback={<Loader />}>
        <TaskFilters />
      </Suspense>

      {showCreateForm && (
        <Paper p="md" mb="md" withBorder>
          <TaskForm
            onSubmit={
              handleCreate as (
                input: CreateTaskInput | UpdateTaskInput
              ) => Promise<void>
            }
            onCancel={() => setShowCreateForm(false)}
            loading={creating}
          />
        </Paper>
      )}

      {editingTask && (
        <Paper p="md" mb="md" withBorder>
          <TaskForm
            task={editingTask}
            onSubmit={
              handleUpdate as (
                input: CreateTaskInput | UpdateTaskInput
              ) => Promise<void>
            }
            onCancel={() => setEditingTask(null)}
            loading={updating}
          />
        </Paper>
      )}

      {error && <TaskErrorState error={error} />}

      {loading && !tasks.length ? (
        <TaskLoadingState />
      ) : tasks.length === 0 ? (
        <TaskEmptyState />
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={(task) => setEditingTask(task)}
          onDelete={(id) => handleDelete(id)}
          onStatusChange={(task, newStatus) =>
            handleStatusChange(task, newStatus)
          }
          updating={updating || deleting}
        />
      )}
    </>
  );
}

export default function TasksPage() {
  const { loading: authLoading } = useAuth();

  // Show loading if auth is still checking
  if (authLoading) {
    return (
      <Container size="lg" py="xl">
        <TaskLoadingState />
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Suspense fallback={<TaskLoadingState />}>
        <TasksPageContent />
      </Suspense>
    </Container>
  );
}
