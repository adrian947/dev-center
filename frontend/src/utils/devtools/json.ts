import { fail, messageOf, ok, type ToolResult } from "./result.js";

export type JsonIndent = 2 | 4 | "tab";

export interface JsonErrorInfo {
  message: string;
  line?: number;
  column?: number;
}

export function describeJsonError(error: unknown, input: string): JsonErrorInfo {
  const message = messageOf(error);
  const lineColumn = /line (\d+) column (\d+)/.exec(message);
  if (lineColumn) {
    return { message, line: Number(lineColumn[1]), column: Number(lineColumn[2]) };
  }

  const position = /position (\d+)/.exec(message);
  if (position) {
    const offset = Number(position[1]);
    const before = input.slice(0, offset).split("\n");
    return { message, line: before.length, column: (before[before.length - 1]?.length ?? 0) + 1 };
  }

  return { message };
}

// Cierres pendientes (fuera de strings) para dar una pista cuando el JSON termina antes de tiempo.
export function missingClosers(input: string): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (const char of input) {
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") stack.push("}");
    else if (char === "[") stack.push("]");
    else if ((char === "}" || char === "]") && stack[stack.length - 1] === char) stack.pop();
  }

  return stack.reverse().join("");
}

function indentValue(indent: JsonIndent): string | number {
  return indent === "tab" ? "\t" : indent;
}

function parse(input: string): ToolResult<unknown> {
  try {
    return ok(JSON.parse(input));
  } catch (error) {
    const info = describeJsonError(error, input);
    const where =
      info.line && !info.message.includes("line") ? ` (${info.line}:${info.column})` : "";
    const closers = missingClosers(input);
    const hint = closers ? ` — missing closing: ${closers}` : "";
    return fail(`${info.message}${where}${hint}`);
  }
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortKeysDeep((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}

export function formatJson(input: string, indent: JsonIndent = 2): ToolResult {
  const parsed = parse(input);
  if (!parsed.ok) return parsed;
  return ok(JSON.stringify(parsed.value, null, indentValue(indent)));
}

export function minifyJson(input: string): ToolResult {
  const parsed = parse(input);
  if (!parsed.ok) return parsed;
  return ok(JSON.stringify(parsed.value));
}

export function validateJson(input: string): ToolResult<true> {
  const parsed = parse(input);
  return parsed.ok ? ok(true as const) : parsed;
}

export function sortJsonKeys(input: string, indent: JsonIndent = 2): ToolResult {
  const parsed = parse(input);
  if (!parsed.ok) return parsed;
  return ok(JSON.stringify(sortKeysDeep(parsed.value), null, indentValue(indent)));
}
