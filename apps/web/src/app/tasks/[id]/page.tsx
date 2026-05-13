/**
 * @file page.tsx
 * @author Guy Romelle Magayano
 * @description Single-task detail route
 */

"use client";

import { useEffect } from "react";

import { useQuery } from "@apollo/client/react";
import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { TaskDetailView } from "@web/components/tasks/detail-view/TaskDetailView";
import { TaskErrorState } from "@web/components/tasks/error-state/TaskErrorState";
import { TaskLoadingState } from "@web/components/tasks/loading-state/TaskLoadingState";
import { useAuth } from "@web/lib/auth/context";
import { GET_TASK_QUERY, type Task } from "@web/lib/graphql/tasks";

interface GetTaskQueryData {
  task: Task | null;
}

export default function TaskDetailPage() {
  const { loading: authLoading, user } = useAuth();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const taskId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, router, user]);

  const { data, loading, error } = useQuery<GetTaskQueryData>(GET_TASK_QUERY, {
    variables: { id: taskId },
    skip: !user || !taskId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  if (authLoading || !user || (loading && !data?.task)) {
    return (
      <Container size="md" py="xl">
        <TaskLoadingState />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <TaskErrorState error={error} />
      </Container>
    );
  }

  if (!data?.task) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder p="lg">
          <Stack gap="sm">
            <Title order={2}>Task not found</Title>
            <Text c="dimmed">
              This task is unavailable or you no longer have access to it.
            </Text>
            <Text component={Link} href="/tasks" c="blue">
              Back to tasks
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <TaskDetailView task={data.task} />
    </Container>
  );
}
