import { describe, expect, it } from "vitest";
import { convertData } from "./dataFormat.js";

const CSV = "name,age\nAda,36\nLinus,54";

describe("dataFormat", () => {
  it("converts a 2-row CSV to a JSON array of 2 objects", async () => {
    const result = await convertData(CSV, "csv", "json");
    expect(result.ok && JSON.parse(result.value)).toEqual([
      { name: "Ada", age: "36" },
      { name: "Linus", age: "54" },
    ]);
  });

  it("round-trips CSV -> JSON -> CSV", async () => {
    const json = await convertData(CSV, "csv", "json");
    expect(json.ok).toBe(true);
    const back = await convertData(json.ok ? json.value : "", "json", "csv");
    expect(back).toEqual({ ok: true, value: CSV });
  });

  it("honours the delimiter in both directions", async () => {
    const semicolon = "name;age\nAda;36";
    const json = await convertData(semicolon, "csv", "json", { delimiter: ";" });
    expect(json.ok && JSON.parse(json.value)).toEqual([{ name: "Ada", age: "36" }]);
    expect(
      await convertData(json.ok ? json.value : "", "json", "csv", { delimiter: "\t" }),
    ).toEqual({
      ok: true,
      value: "name\tage\nAda\t36",
    });
  });

  it("converts between JSON and YAML", async () => {
    const yaml = await convertData('{"a":1,"b":[1,2]}', "json", "yaml");
    expect(yaml).toEqual({ ok: true, value: "a: 1\nb:\n  - 1\n  - 2" });
    const json = await convertData("a: 1\nb:\n  - 1\n  - 2", "yaml", "json");
    expect(json.ok && JSON.parse(json.value)).toEqual({ a: 1, b: [1, 2] });
  });

  it("wraps a single object as one CSV row and flattens nested values", async () => {
    const result = await convertData('{"id":1,"tags":["a","b"]}', "json", "csv");
    expect(result).toEqual({ ok: true, value: 'id,tags\n1,"[""a"",""b""]"' });
  });

  it("rejects scalars and empty arrays when targeting CSV", async () => {
    expect((await convertData("42", "json", "csv")).ok).toBe(false);
    expect((await convertData("[]", "json", "csv")).ok).toBe(false);
  });

  it("surfaces parse errors", async () => {
    expect((await convertData("{bad", "json", "yaml")).ok).toBe(false);
    expect((await convertData("a: [1,", "yaml", "json")).ok).toBe(false);
  });
});
