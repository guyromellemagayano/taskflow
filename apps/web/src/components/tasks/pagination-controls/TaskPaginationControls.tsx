/**
 * @file TaskPaginationControls.tsx
 * @author Guy Romelle Magayano
 * @description Pagination controls for the task workspace
 */

"use client";

import { Button, Group, Paper, Text } from "@mantine/core";

export interface TaskPaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  onPageChange: (nextPage: number) => void;
}

export function TaskPaginationControls(props: TaskPaginationControlsProps) {
  const { page, pageSize, total, hasMore, loading, onPageChange } = props;

  if (total <= pageSize) {
    return null;
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <Paper withBorder p="md">
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Showing {start}-{end} of {total} tasks
        </Text>

        <Group gap="sm" align="center">
          <Button
            variant="default"
            onClick={() => onPageChange(page - 1)}
            disabled={loading || page <= 1}
          >
            Previous
          </Button>
          <Text size="sm">
            Page {page} of {pageCount}
          </Text>
          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={loading || !hasMore}
          >
            Next
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
