/**
 * @file TaskForm.tsx
 * @author Guy Romelle Magayano
 * @description Task form component for creating and editing tasks
 */

import { type FormHTMLAttributes, useCallback, useMemo } from "react";

import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@web/lib/constants/tasks";
import {
  type CreateTaskInput,
  type Task,
  type UpdateTaskInput,
} from "@web/lib/graphql/tasks";
import { useToast } from "@web/lib/hooks/useToast";
import { extractErrorMessage } from "@web/lib/utils/apollo";

export interface TaskFormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> {
  task?: Task;
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TaskForm(props: TaskFormProps) {
  const { task, onSubmit, onCancel, loading = false, ...rest } = props;

  const isEditing = Boolean(task);

  const toast = useToast();

  const initialValues = useMemo(
    () => ({
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "todo",
      priority: task?.priority || "medium",
      dueDate: task?.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null,
    }),
    [task]
  );

  const form = useForm({
    initialValues,
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
    },
  });

  const taskId = useMemo(() => task?.id || "", [task?.id]);

  const handleSubmit = form.onSubmit(async (values) => {
    let dueDateValue: string | null = null;
    if (values.dueDate) {
      const date =
        values.dueDate instanceof Date
          ? values.dueDate
          : new Date(values.dueDate as string);
      if (!isNaN(date.getTime())) {
        const isoString = date.toISOString();
        dueDateValue = isoString.split("T")[0] ?? null;
      }
    }

    const input: CreateTaskInput | UpdateTaskInput = {
      ...(isEditing && { id: taskId }),
      title: values.title,
      description: values.description || null,
      status: values.status as Task["status"],
      priority: values.priority as Task["priority"],
      dueDate: dueDateValue,
    };

    try {
      await onSubmit(input);
      if (!isEditing) {
        form.reset();
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.showError(errorMessage);
      throw err;
    }
  });

  const handleDateChange = useCallback(
    (value: unknown) => {
      const date = value as Date | null;
      form.setFieldValue("dueDate", date);
    },
    [form]
  );

  return (
    <form onSubmit={handleSubmit} {...rest}>
      <Stack gap="md">
        <TextInput
          label="Title"
          placeholder="Task title"
          required
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          placeholder="Task description (optional)"
          rows={3}
          {...form.getInputProps("description")}
        />
        <Group grow>
          <Select
            label="Status"
            data={STATUS_OPTIONS}
            {...form.getInputProps("status")}
          />
          <Select
            label="Priority"
            data={PRIORITY_OPTIONS}
            {...form.getInputProps("priority")}
          />
        </Group>
        <DateInput
          label="Due Date"
          placeholder="Select due date (optional)"
          value={form.values.dueDate}
          onChange={handleDateChange}
          clearable
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? "Update" : "Create"} Task
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
