/**
 * @file TaskPageHeader.tsx
 * @author Guy Romelle Magayano
 * @description Page header component with title and new task button
 */

import { memo } from "react";

import { Button, Group, type GroupProps, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export interface TaskPageHeaderProps extends GroupProps {
  onNewTaskClick: () => void;
}

const PAGE_TITLE = "My Tasks";
const BUTTON_TEXT = "New Task";
const ICON_SIZE = 16;

const plusIcon = <IconPlus size={ICON_SIZE} />;

function TaskPageHeaderComponent(props: TaskPageHeaderProps) {
  const { onNewTaskClick, ...rest } = props;

  return (
    <Group justify="space-between" mb="xl" {...rest}>
      <Title order={1}>{PAGE_TITLE}</Title>
      <Button leftSection={plusIcon} onClick={onNewTaskClick}>
        {BUTTON_TEXT}
      </Button>
    </Group>
  );
}

export const TaskPageHeader = memo(TaskPageHeaderComponent);
