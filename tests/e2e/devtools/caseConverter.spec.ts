import { expect, test } from "@playwright/test";

test("Case converter: shows every variant at once", async ({ page }) => {
  await page.goto("/devtools/case-converter");

  await page.getByLabel("Entrada").fill("hello world foo");

  await expect(page.getByText("helloWorldFoo", { exact: true })).toBeVisible();
  await expect(page.getByText("hello_world_foo", { exact: true })).toBeVisible();
  await expect(page.getByText("HELLO_WORLD_FOO", { exact: true })).toBeVisible();
});

test("Case converter: example button loads a sample", async ({ page }) => {
  await page.goto("/devtools/case-converter");

  await page.getByRole("button", { name: "Ejemplo" }).click();
  await expect(page.getByText("helloWorldFooBar", { exact: true })).toBeVisible();
});
