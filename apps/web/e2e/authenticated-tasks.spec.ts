import { expect, type Page, type Route, test } from "@playwright/test";

type TaskStatus = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface TaskRecord {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface GraphQLRequest {
  operationName?: string;
  query?: string;
  variables?: Record<string, unknown>;
}

interface TaskMutationInput {
  id?: string;
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  dueDate?: string | null;
}

const TEST_USER = {
  id: "user-browser-coverage",
  email: "browser-coverage@example.com",
  createdAt: "2026-05-13T00:00:00.000Z",
};

const ACCESS_TOKEN_KEY = "taskflow_access_token";
const REFRESH_TOKEN_KEY = "taskflow_refresh_token";
const MOCK_ACCESS_TOKEN = "browser-coverage-access-token";
const MOCK_REFRESH_TOKEN = "browser-coverage-refresh-token";

function timestamp(index: number) {
  return new Date(
    Date.UTC(2026, 4, 13, 12, 0, 0) - index * 60_000
  ).toISOString();
}

function makeTask(
  index: number,
  overrides: Partial<TaskRecord> = {}
): TaskRecord {
  const paddedIndex = String(index).padStart(2, "0");

  return {
    id: `task-${paddedIndex}`,
    title: `Task ${paddedIndex}`,
    description: `Pagination detail task ${index}`,
    status: "todo",
    priority: "medium",
    dueDate: null,
    userId: TEST_USER.id,
    createdAt: timestamp(index),
    updatedAt: timestamp(index),
    ...overrides,
  };
}

function operationNameFrom(body: GraphQLRequest) {
  if (body.operationName) {
    return body.operationName;
  }

  const operationMatch = body.query?.match(/\b(?:query|mutation)\s+(\w+)/);
  return operationMatch?.[1] ?? "";
}

function hasOwn<Input extends object, Key extends PropertyKey>(
  input: Input,
  key: Key
): input is Input & Record<Key, unknown> {
  return Object.prototype.hasOwnProperty.call(input, key);
}

function compareTaskValue(a: TaskRecord, b: TaskRecord, sortBy: string) {
  const left = String(a[sortBy as keyof TaskRecord] ?? "");
  const right = String(b[sortBy as keyof TaskRecord] ?? "");
  return left.localeCompare(right);
}

function queryTasks(
  tasks: TaskRecord[],
  variables: Record<string, unknown> | undefined
) {
  const filters = (variables?.filters ?? {}) as {
    priority?: TaskPriority;
    search?: string;
    status?: TaskStatus;
  };
  const sortBy = String(variables?.sortBy ?? "createdAt");
  const sortOrder = String(variables?.sortOrder ?? "desc");
  const limit = Number(variables?.limit ?? 20);
  const offset = Number(variables?.offset ?? 0);

  const filteredTasks = tasks
    .filter((task) => !filters.status || task.status === filters.status)
    .filter((task) => !filters.priority || task.priority === filters.priority)
    .filter((task) => {
      if (!filters.search) {
        return true;
      }

      const search = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(search) ||
        (task.description ?? "").toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const comparison = compareTaskValue(a, b, sortBy);
      return sortOrder === "asc" ? comparison : comparison * -1;
    });

  const pageTasks = filteredTasks.slice(offset, offset + limit);

  return {
    tasks: pageTasks,
    total: filteredTasks.length,
    limit,
    offset,
    hasMore: offset + pageTasks.length < filteredTasks.length,
  };
}

async function fulfillGraphQL(route: Route, data: Record<string, unknown>) {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ data }),
  });
}

async function installAuthenticatedGraphQL(
  page: Page,
  initialTasks: TaskRecord[]
) {
  let nextCreatedTaskIndex = 1;
  let tasks = initialTasks.map((task) => ({ ...task }));
  const authorizationHeaders: Array<string | undefined> = [];
  const cookieHeaders: Array<string | undefined> = [];

  await page.context().addCookies([
    {
      name: ACCESS_TOKEN_KEY,
      value: MOCK_ACCESS_TOKEN,
      url: "http://127.0.0.1:3000",
      httpOnly: true,
      sameSite: "Lax",
    },
    {
      name: REFRESH_TOKEN_KEY,
      value: MOCK_REFRESH_TOKEN,
      url: "http://127.0.0.1:3000",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  await page.route("**/graphql", async (route) => {
    const headers = route.request().headers();
    authorizationHeaders.push(headers.authorization);
    cookieHeaders.push(headers.cookie);

    const body = route.request().postDataJSON() as GraphQLRequest;
    const variables = body.variables;

    switch (operationNameFrom(body)) {
      case "Me":
        await fulfillGraphQL(route, { me: TEST_USER });
        return;

      case "GetTasks":
        await fulfillGraphQL(route, { tasks: queryTasks(tasks, variables) });
        return;

      case "GetTask": {
        const id = String(variables?.id ?? "");
        const task = tasks.find((candidate) => candidate.id === id) ?? null;
        await fulfillGraphQL(route, { task });
        return;
      }

      case "CreateTask": {
        const input = (variables?.input ?? {}) as TaskMutationInput;
        const createdAt = new Date().toISOString();
        const task: TaskRecord = {
          id: `created-task-${nextCreatedTaskIndex++}`,
          title: input.title ?? "Untitled task",
          description: input.description ?? null,
          status: input.status ?? "todo",
          priority: input.priority ?? "medium",
          dueDate: input.dueDate ?? null,
          userId: TEST_USER.id,
          createdAt,
          updatedAt: createdAt,
        };

        tasks = [task, ...tasks];
        await fulfillGraphQL(route, { createTask: task });
        return;
      }

      case "UpdateTask": {
        const input = (variables?.input ?? {}) as TaskMutationInput;
        const existingTask = tasks.find((task) => task.id === input.id);

        if (!existingTask) {
          await fulfillGraphQL(route, { updateTask: null });
          return;
        }

        const updatedTask: TaskRecord = {
          ...existingTask,
          title: input.title ?? existingTask.title,
          description: hasOwn(input, "description")
            ? (input.description ?? null)
            : existingTask.description,
          status: input.status ?? existingTask.status,
          priority: input.priority ?? existingTask.priority,
          dueDate: hasOwn(input, "dueDate")
            ? (input.dueDate ?? null)
            : existingTask.dueDate,
          updatedAt: new Date().toISOString(),
        };

        tasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        await fulfillGraphQL(route, { updateTask: updatedTask });
        return;
      }

      case "DeleteTask": {
        const id = String(variables?.id ?? "");
        const initialLength = tasks.length;
        tasks = tasks.filter((task) => task.id !== id);
        await fulfillGraphQL(route, {
          deleteTask: tasks.length < initialLength,
        });
        return;
      }

      default:
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [
              { message: `Unhandled operation: ${operationNameFrom(body)}` },
            ],
          }),
        });
    }
  });

  return {
    authorizationHeaders,
    cookieHeaders,
  };
}

test.describe("authenticated task workspace", () => {
  test("creates, edits, changes status, and deletes a task", async ({
    page,
  }) => {
    const sessionHeaders = await installAuthenticatedGraphQL(page, [
      makeTask(1, {
        id: "existing-task",
        title: "Existing backlog item",
        description: "Already on the board",
      }),
    ]);

    await page.goto("/tasks");

    await expect(page.getByRole("heading", { name: "My Tasks" })).toBeVisible();
    await expect(
      page.getByRole("article", { name: /Existing backlog item/ })
    ).toBeVisible();

    await page.getByRole("button", { name: "New Task" }).click();
    await page.getByLabel("Title").fill("Browser created task");
    await page
      .getByLabel("Description")
      .fill("Created through authenticated Playwright coverage");
    await page.getByRole("button", { name: "Create Task" }).click();

    const createdTask = page.getByRole("article", {
      name: /Browser created task/,
    });
    await expect(createdTask).toBeVisible();

    await createdTask
      .getByRole("button", { name: "Open task actions" })
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByLabel("Title").fill("Browser updated task");
    await page.getByRole("button", { name: "Update Task" }).click();

    const updatedTask = page.getByRole("article", {
      name: /Browser updated task/,
    });
    await expect(updatedTask).toBeVisible();
    await expect(createdTask).toHaveCount(0);

    await updatedTask.getByRole("button", { name: "Start task" }).click();
    await expect(updatedTask.getByText("in progress")).toBeVisible();

    await updatedTask
      .getByRole("button", { name: "Mark task as done" })
      .click();
    await expect(updatedTask.getByText("done")).toBeVisible();

    await updatedTask
      .getByRole("button", { name: "Open task actions" })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    const deleteDialog = page.getByRole("dialog", { name: "Delete Task" });
    await deleteDialog.getByRole("button", { name: "Delete" }).click();

    await expect(updatedTask).toHaveCount(0);
    await expect(
      page.getByRole("article", { name: /Existing backlog item/ })
    ).toBeVisible();
    expect(sessionHeaders.authorizationHeaders.filter(Boolean)).toEqual([]);
    expect(
      sessionHeaders.cookieHeaders.some((header) =>
        header?.includes(ACCESS_TOKEN_KEY)
      )
    ).toBe(true);
  });

  test("paginates through tasks and opens the detail route", async ({
    page,
  }) => {
    const sessionHeaders = await installAuthenticatedGraphQL(
      page,
      Array.from({ length: 21 }, (_, index) => makeTask(index + 1))
    );

    await page.goto("/tasks");

    await expect(page.getByText("Showing 1-20 of 21 tasks")).toBeVisible();
    await expect(page.getByText("Page 1 of 2")).toBeVisible();
    await expect(page.getByRole("article", { name: /Task 01/ })).toBeVisible();

    await page.getByRole("button", { name: "Next", exact: true }).click();

    await expect(page).toHaveURL(/\/tasks\?page=2$/);
    await expect(page.getByText("Showing 21-21 of 21 tasks")).toBeVisible();
    await expect(page.getByText("Page 2 of 2")).toBeVisible();

    const finalTask = page.getByRole("article", { name: /Task 21/ });
    await expect(finalTask).toBeVisible();

    await finalTask.getByRole("link", { name: "Task 21" }).click();

    await expect(page).toHaveURL(/\/tasks\/task-21$/);
    await expect(page.getByRole("heading", { name: "Task 21" })).toBeVisible();
    await expect(page.getByText("Pagination detail task 21")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Manage in workspace" })
    ).toHaveAttribute("href", "/tasks");

    await page.getByRole("link", { name: "Back to tasks" }).click();
    await expect(page).toHaveURL(/\/tasks$/);
    expect(sessionHeaders.authorizationHeaders.filter(Boolean)).toEqual([]);
    expect(
      sessionHeaders.cookieHeaders.some((header) =>
        header?.includes(ACCESS_TOKEN_KEY)
      )
    ).toBe(true);
  });
});
