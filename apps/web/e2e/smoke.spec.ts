import { expect, test } from "@playwright/test";

test.describe("web smoke coverage", () => {
  test("renders the public home page shell", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Welcome to TaskFlow" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "API Connection Status" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Available Endpoints" })
    ).toBeVisible();
  });

  test("renders the login and signup entry points", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Password", exact: true })
    ).toBeVisible();

    await page.goto("/signup");

    await expect(
      page.getByRole("heading", { name: "Create account" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Password", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Confirm Password" })
    ).toBeVisible();
  });

  test("redirects unauthenticated task visits to login", async ({ page }) => {
    await page.goto("/tasks");

    await page.waitForURL("**/login");
    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible();
  });
});
