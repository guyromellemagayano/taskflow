/**
 * @file page.tsx
 * @author Guy Romelle Magayano
 * @description Task list page with filtering, sorting, and pagination
 */

"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { Container, Loader, Paper } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { TaskEmptyState } from "@web/components/tasks/empty-state/TaskEmptyState";
import { TaskErrorState } from "@web/components/tasks/error-state/TaskErrorState";
import { TaskFilters } from "@web/components/tasks/filters/TaskFilters";
import { TaskForm } from "@web/components/tasks/form/TaskForm";
import { TaskList } from "@web/components/tasks/list/TaskList";
import { TaskLoadingState } from "@web/components/tasks/loading-state/TaskLoadingState";
import { TaskPageHeader } from "@web/components/tasks/page-header/TaskPageHeader";
import { TaskPaginationControls } from "@web/components/tasks/pagination-controls/TaskPaginationControls";
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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filters and sort params from URL
  const { filters, sortBy, sortOrder, page, limit, offset } = useTaskFilters();

  // Task management
  const {
    tasks,
    total,
    hasMore,
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
    limit,
    offset,
    enabled: Boolean(user),
  });

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [limit, total]
  );

  const buildPageUrl = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(nextPage));
      }

      const nextQuery = params.toString();
      return nextQuery ? `${pathname}?${nextQuery}` : pathname;
    },
    [pathname, searchParams]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (nextPage < 1 || nextPage === page) {
        return;
      }

      router.push(buildPageUrl(nextPage));
    },
    [buildPageUrl, page, router]
  );

  // UI state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Task action handlers
  const { handleCreate, handleUpdate, handleDelete, handleStatusChange } =
    useTaskActions({
      createTask,
      updateTask,
      deleteTask,
      onTaskCreated: () => {
        setShowCreateForm(false);
        if (page > 1) {
          router.push(pathname);
        }
      },
      onTaskUpdated: () => setEditingTask(null),
    });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [router, user]);

  useEffect(() => {
    if (loading || total === 0 || page <= pageCount) {
      return;
    }

    router.replace(buildPageUrl(pageCount));
  }, [buildPageUrl, loading, page, pageCount, router, total]);

  if (!user) {
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
      ) : total === 0 ? (
        <TaskEmptyState />
      ) : (
        <>
          <TaskList
            tasks={tasks}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(id) => handleDelete(id)}
            onStatusChange={(task, newStatus) =>
              handleStatusChange(task, newStatus)
            }
            updating={updating || deleting}
          />
          <TaskPaginationControls
            page={page}
            pageSize={limit}
            total={total}
            hasMore={hasMore}
            loading={loading}
            onPageChange={handlePageChange}
          />
        </>
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
