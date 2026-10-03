import { describe, expect, it } from "vitest";
import { escapeHtml, escapeJsonString, unescapeHtml, unescapeJsonString } from "./htmlEntities.js";

describe("htmlEntities", () => {
  it("escapes the HTML special characters", () => {
    expect(escapeHtml('<a href="x">&</a>')).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;");
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("round-trips through unescape", () => {
    const original = `<a href="x">&</a> 'q'`;
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it("escapes non-ASCII as numeric entities on demand", () => {
    expect(escapeHtml("é😀", true)).toBe("&#233;&#128512;");
    expect(escapeHtml("é")).toBe("é");
  });

  it("unescapes named, decimal and hex entities and keeps unknown ones", () => {
    expect(unescapeHtml("&amp;&lt;&#65;&#x42;&nbsp;&bogus;")).toBe("&<AB &bogus;");
    expect(unescapeHtml("&#99999999999;")).toBe("&#99999999999;");
  });

  it("escapes and unescapes JSON strings", () => {
    expect(escapeJsonString('a"b\nc')).toBe('a\\"b\\nc');
    expect(unescapeJsonString('a\\"b\\nc')).toEqual({ ok: true, value: 'a"b\nc' });
    expect(unescapeJsonString('bad"quote').ok).toBe(false);
  });
});
