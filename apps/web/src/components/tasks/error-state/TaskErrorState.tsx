/**
 * @file TaskErrorState.tsx
 * @author Guy Romelle Magayano
 * @description Error state component for task list
 */

"use client";

import { memo } from "react";

import { Alert, type AlertProps } from "@mantine/core";

export interface TaskErrorStateProps extends AlertProps {
  error: Error;
}

const DEFAULT_ERROR_MESSAGE = "Failed to load tasks";

function TaskErrorStateComponent(props: TaskErrorStateProps) {
  const { error, ...rest } = props;

  const errorMessage = error.message ? error.message : DEFAULT_ERROR_MESSAGE;

  return (
    <Alert color="red" mb="md" {...rest}>
      {errorMessage}
    </Alert>
  );
}

export const TaskErrorState = memo(TaskErrorStateComponent);
