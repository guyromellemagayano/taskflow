/**
 * @file TaskEmptyState.tsx
 * @author Guy Romelle Magayano
 * @description Empty state component when no tasks are found
 */

import { memo } from "react";

import { Paper, type PaperProps, Text } from "@mantine/core";

export interface TaskEmptyStateProps extends PaperProps {}

const EMPTY_STATE_MESSAGE =
  "No tasks found. Create your first task to get started!";

function TaskEmptyStateComponent(props: TaskEmptyStateProps) {
  const { ...rest } = props;

  return (
    <Paper p="xl" withBorder {...rest}>
      <Text c="dimmed" ta="center">
        {EMPTY_STATE_MESSAGE}
      </Text>
    </Paper>
  );
}

export const TaskEmptyState = memo(TaskEmptyStateComponent);
