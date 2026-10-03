import { describe, expect, it } from "vitest";
import {
  describeJsonError,
  formatJson,
  minifyJson,
  missingClosers,
  sortJsonKeys,
  validateJson,
} from "./json.js";

describe("json", () => {
  it("formats with 2 spaces, 4 spaces and tabs", () => {
    expect(formatJson('{"a":1}', 2)).toEqual({ ok: true, value: '{\n  "a": 1\n}' });
    expect(formatJson('{"a":1}', 4)).toEqual({ ok: true, value: '{\n    "a": 1\n}' });
    expect(formatJson('{"a":1}', "tab")).toEqual({ ok: true, value: '{\n\t"a": 1\n}' });
  });

  it("minifies", () => {
    expect(minifyJson('{\n  "a": 1,\n  "b": [1, 2]\n}')).toEqual({
      ok: true,
      value: '{"a":1,"b":[1,2]}',
    });
  });

  it("sorts keys recursively", () => {
    expect(sortJsonKeys('{"b":1,"a":2}', 2)).toEqual({
      ok: true,
      value: '{\n  "a": 2,\n  "b": 1\n}',
    });
    const nested = sortJsonKeys('{"z":{"y":1,"x":2},"a":[{"d":1,"c":2}]}');
    expect(nested.ok && JSON.parse(nested.value)).toEqual({
      z: { y: 1, x: 2 },
      a: [{ d: 1, c: 2 }],
    });
    expect(nested.ok && nested.value.indexOf('"x"')).toBeLessThan(
      nested.ok ? nested.value.indexOf('"y"') : 0,
    );
  });

  it("reports parse errors for invalid JSON", () => {
    const result = formatJson("{a:1}");
    expect(result.ok).toBe(false);
    expect(validateJson("{a:1}").ok).toBe(false);
    expect(validateJson('{"a":1}')).toEqual({ ok: true, value: true });
  });

  it("derives line and column from a position message", () => {
    const info = describeJsonError(
      new Error("Unexpected token } in JSON at position 8"),
      '{\n  "a":}',
    );
    expect(info.line).toBe(2);
    expect(info.column).toBe(7);
  });

  it("uses line/column when the engine provides them", () => {
    const info = describeJsonError(new Error("Expected ',' (line 3 column 5)"), "");
    expect(info).toMatchObject({ line: 3, column: 5 });
  });

  it("lists the closers missing at the end of truncated JSON", () => {
    expect(missingClosers('{"a":{"b":[1,2')).toBe("]}}");
    expect(missingClosers('{"a":"}"}')).toBe("");
    expect(missingClosers('{"a":"\\"}')).toBe("}");
    const result = formatJson('{"a":{"b":1}');
    expect(!result.ok && result.error).toContain("missing closing: }");
  });
});
