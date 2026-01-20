/**
 * @file TaskList.tsx
 * @author Guy Romelle Magayano
 * @description Task list component for rendering multiple task cards
 */

"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";

import { Skeleton, Stack, type StackProps } from "@mantine/core";

import { type Task } from "@web/lib/graphql/tasks";

import { TaskCard } from "../card/TaskCard";

export interface TaskListProps extends StackProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (task: Task, newStatus: Task["status"]) => void;
  updating: boolean;
}

const SKELETON_COUNT = 3;
const EMPTY_CALLBACKS = {
  onEdit: () => {},
  onDelete: () => {},
  onStatusChange: () => {},
} as const;

/** Create a skeleton task */
function createSkeletonTask(index: number): Task {
  return {
    id: `skeleton-${index}`,
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: null,
    userId: "",
    createdAt: "",
    updatedAt: "",
  };
}

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (task: Task, newStatus: Task["status"]) => void;
  updating: boolean;
}

// `useLatest` hook for stable callback refs
function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

function TaskItemComponent(props: TaskItemProps) {
  const { task, onEdit, onDelete, onStatusChange, updating } = props;

  // Store callbacks in refs to avoid recreating handlers when callbacks change
  const onEditRef = useLatest(onEdit);
  const onDeleteRef = useLatest(onDelete);
  const onStatusChangeRef = useLatest(onStatusChange);

  const handleEdit = useCallback(() => {
    onEditRef.current(task);
  }, [task, onEditRef]);

  const handleDelete = useCallback(() => {
    onDeleteRef.current(task.id);
  }, [task.id, onDeleteRef]);

  const handleStatusChange = useCallback(
    (newStatus: Task["status"]) => {
      onStatusChangeRef.current(task, newStatus);
    },
    [task, onStatusChangeRef]
  );

  return (
    <div
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "0 120px",
      }}
    >
      <Skeleton visible={updating}>
        <TaskCard
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      </Skeleton>
    </div>
  );
}

const TaskItem = memo(TaskItemComponent, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.dueDate === nextProps.task.dueDate &&
    prevProps.updating === nextProps.updating
  );
});

export function TaskList(props: TaskListProps) {
  const { tasks, onEdit, onDelete, onStatusChange, updating, ...rest } = props;

  // Show skeleton during initial load (when tasks is not yet an array)
  const showSkeleton = !Array.isArray(tasks);

  const skeletonTasks = useMemo(
    () =>
      Array.from({ length: SKELETON_COUNT }, (_, idx) =>
        createSkeletonTask(idx)
      ),
    []
  );

  // Show skeleton during initial load
  if (showSkeleton) {
    return (
      <Stack gap="sm" {...rest}>
        {skeletonTasks.map((task) => (
          <Skeleton key={task.id} visible>
            <TaskCard
              task={task}
              onEdit={EMPTY_CALLBACKS.onEdit}
              onDelete={EMPTY_CALLBACKS.onDelete}
              onStatusChange={EMPTY_CALLBACKS.onStatusChange}
              updating={false}
            />
          </Skeleton>
        ))}
      </Stack>
    );
  }

  // Return null for empty arrays (parent handles empty state)
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm" {...rest}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          updating={updating}
        />
      ))}
    </Stack>
  );
}
