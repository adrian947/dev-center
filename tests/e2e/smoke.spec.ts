import { expect, test } from "@playwright/test";

test("dashboard loads with nav rail and task log", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Command Center" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bitácora de tareas" })).toBeVisible();
});

test("language selector switches from Spanish to English", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Idioma").click();
  await page.getByRole("option", { name: "Inglés" }).click();

  await expect(page.getByRole("heading", { name: "Task log" })).toBeVisible();
});

test("command palette opens with Ctrl/Cmd+K and navigates", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Command Center" })).toBeVisible();

  await page.keyboard.press("Control+k");
  const input = page.getByRole("combobox", { name: "Escribí un comando o buscá…" });
  await expect(input).toBeVisible();

  await input.fill("tareas");
  await page.getByRole("option", { name: "Tareas" }).click();

  await expect(page).toHaveURL(/\/tasks$/);
});
