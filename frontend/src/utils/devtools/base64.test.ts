import { describe, expect, it } from "vitest";
import { decodeBase64, encodeBase64 } from "./base64.js";

describe("base64", () => {
  it("encodes UTF-8 text", () => {
    expect(encodeBase64("héllo")).toBe("aMOpbGxv");
  });

  it("round-trips accents and emoji", () => {
    for (const text of ["héllo", "日本語", "hi 😀"]) {
      expect(decodeBase64(encodeBase64(text))).toEqual({ ok: true, value: text });
    }
  });

  it("supports the URL-safe variant without padding", () => {
    const text = "???>>>";
    const standard = encodeBase64(text);
    const safe = encodeBase64(text, true);
    expect(standard).toContain("/");
    expect(safe).not.toMatch(/[+/=]/);
    expect(decodeBase64(safe)).toEqual({ ok: true, value: text });
  });

  it("decodes input missing padding", () => {
    expect(decodeBase64("aMOpbGxv")).toEqual({ ok: true, value: "héllo" });
    expect(decodeBase64("YQ")).toEqual({ ok: true, value: "a" });
  });

  it("fails on invalid input", () => {
    expect(decodeBase64("@@@").ok).toBe(false);
    expect(decodeBase64("A").ok).toBe(false);
    expect(decodeBase64("/w==").ok).toBe(false); // bytes that are not valid UTF-8
  });
});
