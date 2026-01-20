/**
 * @file TaskLoadingState.tsx
 * @author Guy Romelle Magayano
 * @description Loading state component for task list
 */

import { Group, Loader } from "@mantine/core";

const loadingStateElement = (
  <Group justify="center" py="xl">
    <Loader size="lg" />
  </Group>
);

export function TaskLoadingState() {
  return loadingStateElement;
}
