import { fail, messageOf, ok, byteLength, type ToolResult } from "./result.js";

export const CODE_LANGUAGES = ["css", "js", "html"] as const;
export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

export type CodeAction = "minify" | "beautify";

export interface SizeStats {
  before: number;
  after: number;
  savedPercent: number;
}

export function sizeStats(before: string, after: string): SizeStats {
  const beforeBytes = byteLength(before);
  const afterBytes = byteLength(after);
  const savedPercent = beforeBytes === 0 ? 0 : ((beforeBytes - afterBytes) / beforeBytes) * 100;
  return { before: beforeBytes, after: afterBytes, savedPercent };
}

async function beautify(code: string, language: CodeLanguage): Promise<string> {
  const mod = await import("js-beautify");
  const beautifier = (mod.default ?? mod) as typeof import("js-beautify");
  const options = { indent_size: 2 };
  if (language === "css") return beautifier.css(code, options);
  if (language === "html") return beautifier.html(code, options);
  return beautifier.js(code, options);
}

async function minify(code: string, language: CodeLanguage): Promise<string> {
  if (language === "css") {
    const csso = await import("csso");
    const minifyCss = csso.minify ?? csso.default.minify;
    return minifyCss(code).css;
  }

  if (language === "html") {
    const { minify: minifyHtml } = await import("html-minifier-terser");
    return minifyHtml(code, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });
  }

  const { minify: minifyJs } = await import("terser");
  const result = await minifyJs(code);
  return result.code ?? "";
}

export async function transformCode(
  code: string,
  language: CodeLanguage,
  action: CodeAction,
): Promise<ToolResult> {
  try {
    const output =
      action === "beautify" ? await beautify(code, language) : await minify(code, language);
    return ok(output);
  } catch (error) {
    return fail(messageOf(error));
  }
}
