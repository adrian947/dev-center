import { expect, test } from "@playwright/test";

test("HTML entities: escapes and unescapes", async ({ page }) => {
  await page.goto("/devtools/html-entities");

  await page.getByLabel("Entrada").fill('<a href="x">&</a>');
  await page.getByRole("button", { name: "Escapar HTML", exact: true }).click();
  await expect(page.getByLabel("Salida")).toHaveValue(
    "&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;",
  );

  await page.getByLabel("Entrada").fill("&lt;b&gt;");
  await page.getByRole("button", { name: "Desescapar HTML", exact: true }).click();
  await expect(page.getByLabel("Salida")).toHaveValue("<b>");
});

test("HTML entities: example button loads a sample", async ({ page }) => {
  await page.goto("/devtools/html-entities");

  await page.getByRole("button", { name: "Ejemplo" }).click();
  await expect(page.getByLabel("Salida")).toHaveValue(/&lt;a href=&quot;/);
});
