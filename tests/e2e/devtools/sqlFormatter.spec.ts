import { expect, test } from "@playwright/test";

test("SQL: formats a query with uppercase keywords", async ({ page }) => {
  await page.goto("/devtools/sql-formatter");

  await page.getByLabel("Entrada").fill("select a,b from t where x=1");
  await page.getByRole("button", { name: "Formatear" }).click();

  await expect(page.getByLabel("Salida")).toHaveValue(/SELECT[\s\S]*FROM[\s\S]*WHERE/);
});

test("SQL: example button loads a sample", async ({ page }) => {
  await page.goto("/devtools/sql-formatter");

  await page.getByRole("button", { name: "Ejemplo" }).click();
  await expect(page.getByLabel("Salida")).toHaveValue(/LEFT JOIN/);
});
