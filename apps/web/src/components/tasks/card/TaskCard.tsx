/**
 * @file TaskCard.tsx
 * @author Guy Romelle Magayano
 * @description Task card component for displaying individual tasks
 */

"use client";

import { memo, useCallback, useMemo } from "react";

import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Paper,
  type PaperProps,
  Stack,
  Text,
} from "@mantine/core";
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import Link from "next/link";

import { PRIORITY_COLORS, STATUS_COLORS } from "@web/lib/constants/tasks";
import { type Task } from "@web/lib/graphql/tasks";

export interface TaskCardProps extends PaperProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Task["status"]) => void;
  updating: boolean;
}

function TaskCardComponent(props: TaskCardProps) {
  const { task, onEdit, onDelete, onStatusChange, updating, ...rest } = props;

  const statusLabel = useMemo(
    () => task.status.replace("_", " "),
    [task.status]
  );

  // Memoize formatted due date
  const formattedDueDate = useMemo(() => {
    if (!task.dueDate) {
      return null;
    }

    try {
      return new Date(`${task.dueDate}T00:00:00`).toLocaleDateString();
    } catch {
      return null;
    }
  }, [task.dueDate]);

  const handleMarkDone = useCallback(() => {
    onStatusChange("done");
  }, [onStatusChange]);

  const handleStart = useCallback(() => {
    onStatusChange("in_progress");
  }, [onStatusChange]);

  const handleRevert = useCallback(() => {
    onStatusChange("todo");
  }, [onStatusChange]);

  return (
    <Paper p="md" withBorder {...rest}>
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Group gap="sm">
            {task.title ? (
              <Text component={Link} href={`/tasks/${task.id}`} fw={500}>
                {task.title}
              </Text>
            ) : (
              <Text fw={500}>{task.title}</Text>
            )}
            <Badge color={STATUS_COLORS[task.status]} variant="light">
              {statusLabel}
            </Badge>
            <Badge
              color={PRIORITY_COLORS[task.priority]}
              variant="light"
              size="sm"
            >
              {task.priority}
            </Badge>
          </Group>
          {task.description ? (
            <Text size="sm" c="dimmed">
              {task.description}
            </Text>
          ) : null}
          {formattedDueDate ? (
            <Text size="xs" c="dimmed">
              Due: {formattedDueDate}
            </Text>
          ) : null}
        </Stack>

        <Group gap="xs">
          <Menu>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                disabled={updating}
                aria-label="Open task actions"
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={onEdit}>Edit</Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={onDelete}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {task.status !== "done" ? (
            <ActionIcon
              color="green"
              variant="light"
              onClick={handleMarkDone}
              disabled={updating}
              aria-label="Mark task as done"
            >
              <IconCheck size={16} />
            </ActionIcon>
          ) : null}

          {task.status === "todo" ? (
            <ActionIcon
              color="blue"
              variant="light"
              onClick={handleStart}
              disabled={updating}
              aria-label="Start task"
            >
              Start
            </ActionIcon>
          ) : null}

          {task.status === "in_progress" ? (
            <ActionIcon
              color="gray"
              variant="light"
              onClick={handleRevert}
              disabled={updating}
              aria-label="Move task back to todo"
            >
              <IconX size={16} />
            </ActionIcon>
          ) : null}
        </Group>
      </Group>
    </Paper>
  );
}

export const TaskCard = memo(TaskCardComponent);
