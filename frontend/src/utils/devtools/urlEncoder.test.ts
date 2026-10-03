import { describe, expect, it } from "vitest";
import {
  decodeUrlComponent,
  decodeUrlFull,
  encodeUrlComponent,
  encodeUrlFull,
  parseQueryParams,
} from "./urlEncoder.js";

describe("urlEncoder", () => {
  it("encodes and decodes a component", () => {
    expect(encodeUrlComponent("a b&c=d/é")).toBe("a%20b%26c%3Dd%2F%C3%A9");
    expect(decodeUrlComponent("a%20b%26c")).toEqual({ ok: true, value: "a b&c" });
  });

  it("keeps URL structure when encoding a full URL", () => {
    expect(encodeUrlFull("https://x.com/a b?q=é")).toBe("https://x.com/a%20b?q=%C3%A9");
    expect(decodeUrlFull("https://x.com/a%20b")).toEqual({ ok: true, value: "https://x.com/a b" });
  });

  it("fails on malformed escapes", () => {
    expect(decodeUrlComponent("%E0%A4%A").ok).toBe(false);
  });

  it("lists query params of a pasted URL", () => {
    expect(parseQueryParams("https://x.com/?q=a b&r=1")).toEqual([
      { key: "q", value: "a b" },
      { key: "r", value: "1" },
    ]);
  });

  it("ignores the hash and accepts a bare query string", () => {
    expect(parseQueryParams("https://x.com/?a=1#frag")).toEqual([{ key: "a", value: "1" }]);
    expect(parseQueryParams("a=1&b=2")).toEqual([
      { key: "a", value: "1" },
      { key: "b", value: "2" },
    ]);
  });

  it("returns no params when there is no query", () => {
    expect(parseQueryParams("https://x.com/path")).toEqual([]);
    expect(parseQueryParams("")).toEqual([]);
  });
});
