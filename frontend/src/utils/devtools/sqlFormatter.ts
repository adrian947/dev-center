import { fail, messageOf, ok, type ToolResult } from "./result.js";

export const SQL_DIALECTS = ["sql", "postgresql", "mysql", "sqlite"] as const;
export type SqlDialect = (typeof SQL_DIALECTS)[number];

export interface SqlFormatOptions {
  dialect?: SqlDialect;
  uppercaseKeywords?: boolean;
  indent?: 2 | 4;
}

export async function formatSql(
  input: string,
  options: SqlFormatOptions = {},
): Promise<ToolResult> {
  try {
    const { format } = await import("sql-formatter");
    return ok(
      format(input, {
        language: options.dialect ?? "sql",
        keywordCase: options.uppercaseKeywords === false ? "preserve" : "upper",
        tabWidth: options.indent ?? 2,
      }),
    );
  } catch (error) {
    return fail(messageOf(error));
  }
}
