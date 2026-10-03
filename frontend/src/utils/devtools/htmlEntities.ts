import { fail, ok, type ToolResult } from "./result.js";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function escapeHtml(input: string, escapeNonAscii = false): string {
  const escaped = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  if (!escapeNonAscii) return escaped;
  return Array.from(escaped, (char) => {
    const code = char.codePointAt(0) ?? 0;
    return code > 127 ? `&#${code};` : char;
  }).join("");
}

export function unescapeHtml(input: string): string {
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body.startsWith("#")) {
      const code =
        body[1]?.toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      try {
        return String.fromCodePoint(code);
      } catch {
        return match;
      }
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

export function escapeJsonString(input: string): string {
  return JSON.stringify(input).slice(1, -1);
}

export function unescapeJsonString(input: string): ToolResult {
  try {
    const parsed: unknown = JSON.parse(`"${input}"`);
    return ok(String(parsed));
  } catch {
    return fail("invalid");
  }
}
