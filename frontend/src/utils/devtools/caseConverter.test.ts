import { describe, expect, it } from "vitest";
import { convertAllCases, convertCase, splitWords } from "./caseConverter.js";

describe("caseConverter", () => {
  it("converts plain words to every case", () => {
    expect(convertAllCases("hello world foo")).toEqual({
      camel: "helloWorldFoo",
      pascal: "HelloWorldFoo",
      snake: "hello_world_foo",
      kebab: "hello-world-foo",
      constant: "HELLO_WORLD_FOO",
      dot: "hello.world.foo",
      title: "Hello World Foo",
      sentence: "Hello world foo",
    });
  });

  it("splits camelCase, PascalCase and mixed separators", () => {
    expect(splitWords("fooBar_baz-qux.quux zed")).toEqual([
      "foo",
      "bar",
      "baz",
      "qux",
      "quux",
      "zed",
    ]);
  });

  it("keeps acronyms together until the next word", () => {
    expect(splitWords("parseHTTPServer")).toEqual(["parse", "http", "server"]);
    expect(convertCase("XMLHttpRequest", "snake")).toBe("xml_http_request");
  });

  it("keeps digits attached to their word", () => {
    expect(convertCase("version2Beta", "kebab")).toBe("version2-beta");
  });

  it("handles accents and converts each line separately", () => {
    expect(convertCase("canción nueva\nOtra Línea", "camel")).toBe("canciónNueva\notraLínea");
  });

  it("returns an empty string for empty input", () => {
    expect(convertCase("", "camel")).toBe("");
  });
});
