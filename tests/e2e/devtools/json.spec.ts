import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

test("JSON: sorts keys and reports parse errors", async ({ page }) => {
  await page.goto("/devtools/json");

  await page.getByLabel("Entrada").fill('{"b":1,"a":2}');
  await page.getByRole("button", { name: "Ordenar claves" }).click();
  await expect(page.getByLabel("Salida")).toHaveValue('{\n  "a": 2,\n  "b": 1\n}');

  await page.getByLabel("Entrada").fill("{a:1}");
  await page.getByRole("button", { name: "Formatear" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
});

test("JSON: example button formats a sample", async ({ page }) => {
  await page.goto("/devtools/json");

  await page.getByRole("button", { name: "Ejemplo" }).click();

  await expect(page.getByLabel("Entrada")).toHaveValue(/"Leverbox"/);
  await expect(page.getByLabel("Salida")).toHaveValue(/\n {2}"empresa": \{/);
});

test("JSON: a large document missing its last brace points at the missing closer", async ({
  page,
}) => {
  const document = fs.readFileSync(path.join(__dirname, "fixtures/empresa.json"), "utf-8").trim();
  await page.goto("/devtools/json");

  await page.getByLabel("Entrada").fill(document);
  await page.getByRole("button", { name: "Formatear" }).click();
  await expect(page.getByRole("alert")).toContainText("missing closing: }");

  await page.getByLabel("Entrada").fill(`${document}}`);
  await page.getByRole("button", { name: "Formatear" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  const output = await page.getByLabel("Salida").inputValue();
  expect(output.split("\n").length).toBeGreaterThan(300);
});
