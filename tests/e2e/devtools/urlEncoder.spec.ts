import { expect, test } from "@playwright/test";

test("URL Encoder: encodes a component and lists query params", async ({ page }) => {
  await page.goto("/devtools/url-encoder");

  await page.getByLabel("Entrada").fill("https://x.com/?q=a b&r=1");
  await expect(page.getByRole("cell", { name: "a b" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "r", exact: true })).toBeVisible();

  await page.getByLabel("Entrada").fill("a b&c");
  await page.getByRole("button", { name: "Codificar componente", exact: true }).click();
  await expect(page.getByLabel("Salida")).toHaveValue("a%20b%26c");
});

test("URL Encoder: example button loads a sample", async ({ page }) => {
  await page.goto("/devtools/url-encoder");

  await page.getByRole("button", { name: "Ejemplo" }).click();
  await expect(page.getByLabel("Salida")).toHaveValue(/hola%20mundo/);
  await expect(page.getByRole("cell", { name: "lang", exact: true })).toBeVisible();
});

test("URL Encoder: full URL on an already valid URL explains that nothing changed", async ({
  page,
}) => {
  await page.goto("/devtools/url-encoder");

  await page.getByLabel("Entrada").fill("https://example.com/?a=1&b=2");
  await page.getByRole("button", { name: "Codificar URL completa", exact: true }).click();

  await expect(page.getByLabel("Salida")).toHaveValue("https://example.com/?a=1&b=2");
  await expect(page.getByRole("status")).toContainText("Sin cambios");

  await page.getByLabel("Entrada").fill("https://example.com/ñandú?x=a b");
  await page.getByRole("button", { name: "Codificar URL completa", exact: true }).click();
  await expect(page.getByLabel("Salida")).toHaveValue(
    "https://example.com/%C3%B1and%C3%BA?x=a%20b",
  );
  await expect(page.getByRole("status")).toHaveCount(0);
});
