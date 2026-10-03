import { describe, expect, it } from "vitest";
import { sizeStats, transformCode } from "./minifierBeautifier.js";

const CSS = "/* comment */\nbody {\n  margin: 0;\n  padding: 0;\n}\n\n.a { color: red; }\n";

describe("minifierBeautifier", () => {
  it("minifies CSS and ends smaller than it started", async () => {
    const result = await transformCode(CSS, "css", "minify");
    expect(result.ok).toBe(true);
    const value = result.ok ? result.value : "";
    expect(value).not.toContain("comment");
    expect(value.length).toBeLessThan(CSS.length);
  });

  it("beautifies CSS", async () => {
    const result = await transformCode("a{color:red}b{margin:0}", "css", "beautify");
    expect(result.ok && result.value).toContain("a {\n  color: red\n}");
  });

  it("minifies and beautifies JS", async () => {
    const source = "function add(first, second) {\n  return first + second;\n}\nadd(1, 2);";
    const min = await transformCode(source, "js", "minify");
    expect(min.ok && min.value.length).toBeLessThan(source.length);
    const pretty = await transformCode("function a(){return 1}", "js", "beautify");
    expect(pretty.ok && pretty.value).toContain("function a() {\n  return 1\n}");
  });

  it("minifies and beautifies HTML", async () => {
    const source = "<div>\n  <!-- c -->\n  <p>  hello  </p>\n</div>";
    const min = await transformCode(source, "html", "minify");
    expect(min.ok && min.value).toBe("<div><p>hello</p></div>");
    const pretty = await transformCode("<div><p>hi</p></div>", "html", "beautify");
    expect(pretty.ok && pretty.value).toContain("\n");
  });

  it("returns an error for invalid JS", async () => {
    const result = await transformCode("function (", "js", "minify");
    expect(result.ok).toBe(false);
  });

  it("computes size stats in bytes", () => {
    expect(sizeStats("abcd", "ab")).toEqual({ before: 4, after: 2, savedPercent: 50 });
    expect(sizeStats("", "")).toEqual({ before: 0, after: 0, savedPercent: 0 });
    expect(sizeStats("é", "é").before).toBe(2);
  });
});
