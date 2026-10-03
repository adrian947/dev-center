import { describe, expect, it } from "vitest";
import { formatSql } from "./sqlFormatter.js";

describe("sqlFormatter", () => {
  it("formats on several lines with uppercase keywords", async () => {
    const result = await formatSql("select a,b from t where x=1");
    expect(result.ok).toBe(true);
    const value = result.ok ? result.value : "";
    expect(value.split("\n").length).toBeGreaterThan(1);
    expect(value).toContain("SELECT");
    expect(value).toContain("FROM");
    expect(value).toContain("WHERE");
  });

  it("preserves keyword case when asked", async () => {
    const result = await formatSql("select a from t", { uppercaseKeywords: false });
    expect(result.ok && result.value).toContain("select");
  });

  it("honours the indent width", async () => {
    const two = await formatSql("select a, b from t", { indent: 2 });
    const four = await formatSql("select a, b from t", { indent: 4 });
    expect(two.ok && two.value).toMatch(/\n {2}a,/);
    expect(four.ok && four.value).toMatch(/\n {4}a,/);
  });

  it("supports other dialects", async () => {
    const result = await formatSql('select "a" from t limit 1', { dialect: "postgresql" });
    expect(result.ok).toBe(true);
  });

  it("returns an error on unparseable input", async () => {
    const result = await formatSql("select 'unterminated", { dialect: "postgresql" });
    expect(result.ok).toBe(false);
  });
});
