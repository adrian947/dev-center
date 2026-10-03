import { fail, ok, type ToolResult } from "./result.js";

export interface QueryParam {
  key: string;
  value: string;
}

export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input);
}

export function encodeUrlFull(input: string): string {
  return encodeURI(input);
}

function decodeWith(decoder: (value: string) => string, input: string): ToolResult {
  try {
    return ok(decoder(input));
  } catch {
    return fail("invalid");
  }
}

export function decodeUrlComponent(input: string): ToolResult {
  return decodeWith(decodeURIComponent, input);
}

export function decodeUrlFull(input: string): ToolResult {
  return decodeWith(decodeURI, input);
}

export function parseQueryParams(input: string): QueryParam[] {
  const trimmed = input.trim();
  const questionMark = trimmed.indexOf("?");
  const hash = trimmed.indexOf("#");

  let query: string;
  if (questionMark >= 0) {
    query = trimmed.slice(questionMark + 1, hash > questionMark ? hash : undefined);
  } else if (trimmed.includes("=") && !trimmed.includes("://")) {
    query = trimmed;
  } else {
    return [];
  }

  return [...new URLSearchParams(query).entries()].map(([key, value]) => ({ key, value }));
}
