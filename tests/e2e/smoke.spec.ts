import { expect, test } from "@playwright/test";

test("home page loads and shows the DevCenter title", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Bienvenido a DevCenter" })).toBeVisible();
});

test("language selector switches from Spanish to English", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Idioma").click();
  await page.getByRole("option", { name: "Inglés" }).click();

  await expect(page.getByRole("heading", { name: "Welcome to DevCenter" })).toBeVisible();
});
