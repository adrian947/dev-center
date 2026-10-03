import { fail, ok, type ToolResult } from "./result.js";

export function encodeBase64(text: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary);
  return urlSafe ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encoded;
}

export function decodeBase64(input: string): ToolResult {
  const cleaned = input.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(cleaned)) return fail("invalid");

  let normalized = cleaned.replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  if (normalized.length % 4 === 1) return fail("invalid");
  normalized += "=".repeat((4 - (normalized.length % 4)) % 4);

  try {
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return ok(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return fail("invalid");
  }
}
