import { fail, messageOf, ok, type ToolResult } from "./result.js";

export const DATA_FORMATS = ["csv", "json", "yaml"] as const;
export type DataFormat = (typeof DATA_FORMATS)[number];

export type CsvDelimiter = "," | ";" | "\t";

export interface ConvertOptions {
  delimiter?: CsvDelimiter;
}

async function parseInput(
  input: string,
  from: DataFormat,
  delimiter: CsvDelimiter,
): Promise<ToolResult<unknown>> {
  try {
    if (from === "json") return ok(JSON.parse(input));

    if (from === "yaml") {
      const YAML = await import("yaml");
      return ok(YAML.parse(input));
    }

    const Papa = (await import("papaparse")).default;
    const parsed = Papa.parse<Record<string, string>>(input, {
      header: true,
      skipEmptyLines: true,
      delimiter,
    });
    const firstError = parsed.errors.find((error) => error.type !== "Delimiter");
    if (firstError) {
      const row = firstError.row === undefined ? "" : ` (row ${firstError.row + 1})`;
      return fail(`${firstError.message}${row}`);
    }
    return ok(parsed.data);
  } catch (error) {
    return fail(messageOf(error));
  }
}

function flattenCell(value: unknown): unknown {
  return value !== null && typeof value === "object" ? JSON.stringify(value) : value;
}

async function stringifyOutput(
  value: unknown,
  to: DataFormat,
  delimiter: CsvDelimiter,
): Promise<ToolResult> {
  try {
    if (to === "json") return ok(JSON.stringify(value, null, 2));

    if (to === "yaml") {
      const YAML = await import("yaml");
      return ok(YAML.stringify(value).trimEnd());
    }

    const rows = Array.isArray(value) ? value : [value];
    if (
      rows.length === 0 ||
      !rows.every((row) => row !== null && typeof row === "object" && !Array.isArray(row))
    ) {
      return fail("csv-shape");
    }

    const Papa = (await import("papaparse")).default;
    const flat = rows.map((row) =>
      Object.fromEntries(
        Object.entries(row as Record<string, unknown>).map(([key, cell]) => [
          key,
          flattenCell(cell),
        ]),
      ),
    );
    return ok(Papa.unparse(flat, { delimiter, newline: "\n" }));
  } catch (error) {
    return fail(messageOf(error));
  }
}

export async function convertData(
  input: string,
  from: DataFormat,
  to: DataFormat,
  options: ConvertOptions = {},
): Promise<ToolResult> {
  const delimiter = options.delimiter ?? ",";
  const parsed = await parseInput(input, from, delimiter);
  if (!parsed.ok) return parsed;
  return stringifyOutput(parsed.value, to, delimiter);
}
