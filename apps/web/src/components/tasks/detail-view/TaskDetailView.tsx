/**
 * @file TaskDetailView.tsx
 * @author Guy Romelle Magayano
 * @description Read-only single-task detail view for the web app
 */

"use client";

import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

import { PRIORITY_COLORS, STATUS_COLORS } from "@web/lib/constants/tasks";
import { type Task } from "@web/lib/graphql/tasks";

function formatDateValue(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString();
  } catch {
    return null;
  }
}

function formatDateTimeValue(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export interface TaskDetailViewProps {
  task: Task;
}

export function TaskDetailView(props: TaskDetailViewProps) {
  const { task } = props;

  const dueDate = formatDateValue(task.dueDate);
  const createdAt = formatDateTimeValue(task.createdAt);
  const updatedAt = formatDateTimeValue(task.updatedAt);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs">
          <Text component={Link} href="/tasks" c="blue">
            Back to tasks
          </Text>
          <Title order={1}>{task.title}</Title>
          <Text c="dimmed">
            Review the current task context, then return to the workspace for
            edits and state changes.
          </Text>
        </Stack>

        <Text component={Link} href="/tasks" c="blue" fw={500}>
          Manage in workspace
        </Text>
      </Group>

      <Paper withBorder p="lg">
        <Stack gap="md">
          <Group gap="sm">
            <Badge color={STATUS_COLORS[task.status]} variant="light">
              {task.status.replace("_", " ")}
            </Badge>
            <Badge color={PRIORITY_COLORS[task.priority]} variant="light">
              {task.priority}
            </Badge>
          </Group>

          <Stack gap="xs">
            <Text fw={600}>Description</Text>
            <Text c={task.description ? undefined : "dimmed"}>
              {task.description || "No description provided."}
            </Text>
          </Stack>

          <Stack gap="xs">
            <Text fw={600}>Schedule</Text>
            <Text c={dueDate ? undefined : "dimmed"}>
              {dueDate ? `Due ${dueDate}` : "No due date set."}
            </Text>
          </Stack>

          <Stack gap="xs">
            <Text fw={600}>Audit trail</Text>
            <Text size="sm" c="dimmed">
              Created {createdAt}
            </Text>
            <Text size="sm" c="dimmed">
              Last updated {updatedAt}
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
