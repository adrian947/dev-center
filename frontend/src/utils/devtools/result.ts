export type ToolResult<T = string> = { ok: true; value: T } | { ok: false; error: string };

export function ok<T>(value: T): ToolResult<T> {
  return { ok: true, value };
}

export function fail<T = string>(error: string): ToolResult<T> {
  return { ok: false, error };
}

export function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const MAX_INPUT_BYTES = 2 * 1024 * 1024;

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}
