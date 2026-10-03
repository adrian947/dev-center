import { expect, test } from "@playwright/test";

test("Minifier: minifies CSS and shows the size saving", async ({ page }) => {
  await page.goto("/devtools/minifier-beautifier");

  await page.getByLabel("Entrada").fill("/* c */\nbody {\n  margin: 0;\n  padding: 0;\n}\n");
  await page.getByRole("button", { name: "Minificar" }).click();

  await expect(page.getByLabel("Salida")).toHaveValue("body{margin:0;padding:0}");
  await expect(page.getByRole("status")).toContainText("de ahorro");
});

test("Minifier: example button loads a sample", async ({ page }) => {
  await page.goto("/devtools/minifier-beautifier");

  await page.getByRole("button", { name: "Ejemplo" }).click();
  await expect(page.getByLabel("Salida")).toHaveValue(
    /^\.card\{margin:0 auto;padding:16px 24px;color:red\}/,
  );
  await expect(page.getByRole("status")).toContainText("de ahorro");
});
