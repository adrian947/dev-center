import { expect, test } from "@playwright/test";

// Los tests comparten el usuario e2e: se ejecutan en serie y limpian su propio estado.
test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ request }) => {
  await request.delete("/api/tools/favorites/json");
  await request.delete("/api/tools/favorites/jwt");
});

test("opening a tool adds it to Recent Tools on the dashboard", async ({ page }) => {
  await page.goto("/devtools/uuid");
  await expect(page.getByRole("heading", { name: "UUID Generator" })).toBeVisible();

  await page.goto("/");
  const wall = page.locator(".qsl-wall");
  await expect(wall.getByText("UUID Generator")).toBeVisible();
});

test("starring a tool card keeps the favorite after reload and lists it in /favorites", async ({
  page,
}) => {
  await page.goto("/devtools");

  await page.getByRole("button", { name: "Agregar JSON Formatter a favoritos" }).click();
  await expect(
    page.getByRole("button", { name: "Quitar JSON Formatter de favoritos" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/devtools$/);

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Quitar JSON Formatter de favoritos" }),
  ).toBeVisible();

  await page.goto("/favorites");
  await expect(page.getByText("JSON Formatter")).toBeVisible();
  await expect(page.getByText("JWT Decoder")).toHaveCount(0);
});

test("/favorites shows the empty state when nothing is starred", async ({ page }) => {
  await page.goto("/favorites");
  await expect(page.getByText("Todavía no marcaste ninguna herramienta como favorita.")).toBeVisible();
});

test("the UUID tool header has a working favorite star", async ({ page }) => {
  await page.goto("/devtools/uuid");

  await page.getByRole("button", { name: "Agregar a favoritos" }).click();
  await expect(page.getByRole("button", { name: "Quitar de favoritos" })).toBeVisible();

  await page.request.delete("/api/tools/favorites/uuid");
});
