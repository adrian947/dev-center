import { expect, test } from "@playwright/test";

test("Base64: encodes UTF-8 and decodes it back", async ({ page }) => {
  await page.goto("/devtools/base64");

  await page.getByLabel("Entrada").fill("héllo");
  await page.getByRole("button", { name: "Codificar", exact: true }).click();
  await expect(page.getByLabel("Salida")).toHaveValue("aMOpbGxv");

  await page.getByLabel("Entrada").fill("aMOpbGxv");
  await page.getByRole("button", { name: "Decodificar", exact: true }).click();
  await expect(page.getByLabel("Salida")).toHaveValue("héllo");

  await page.getByLabel("Entrada").fill("@@@");
  await page.getByRole("button", { name: "Decodificar", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
});

test("Base64: example button loads a sample", async ({ page }) => {
  await page.goto("/devtools/base64");

  await page.getByRole("button", { name: "Ejemplo" }).click();
  await expect(page.getByLabel("Entrada")).toHaveValue(/DevCenter/);
  await expect(page.getByLabel("Salida")).toHaveValue(/^SG9sYSwgRGV2Q2VudGVy/);
});
