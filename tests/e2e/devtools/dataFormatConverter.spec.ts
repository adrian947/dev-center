import { expect, test } from "@playwright/test";

test("CSV/JSON/YAML: converts CSV to JSON", async ({ page }) => {
  await page.goto("/devtools/data-format");

  await page.getByLabel("Entrada").fill("name,age\nAda,36\nLinus,54");
  await page.getByRole("button", { name: "Convertir" }).click();

  await expect(page.getByLabel("Salida")).toHaveValue(/"name": "Ada"/);
  await expect(page.getByLabel("Salida")).toHaveValue(/"name": "Linus"/);
});

test("CSV/JSON/YAML: example button loads a sample", async ({ page }) => {
  await page.goto("/devtools/data-format");

  await page.getByRole("button", { name: "Ejemplo" }).click();
  await expect(page.getByLabel("Salida")).toHaveValue(/"name": "Grace"/);
});
