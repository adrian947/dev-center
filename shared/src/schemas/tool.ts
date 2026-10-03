import { z } from "zod";

export const TOOL_IDS = [
  "json",
  "jwt",
  "uuid",
  "timestamp",
  "base64",
  "urlEncoder",
  "regex",
  "hash",
  "diff",
  "color",
  "markdown",
  "sqlFormatter",
  "cron",
  "http",
  "passwordGenerator",
  "oneTimeSecret",
  "caseConverter",
  "numberBaseConverter",
  "cidrCalculator",
  "userAgentParser",
  "dataFormatConverter",
  "htmlEntityEscape",
  "fakeDataGenerator",
  "qrCode",
  "colorContrast",
  "unitConverter",
  "minifierBeautifier",
  "tokenGenerator",
] as const;

export type ToolId = (typeof TOOL_IDS)[number];

export const toolIdSchema = z.enum(TOOL_IDS);

export const toolIdParamSchema = z.object({ toolId: toolIdSchema });

export const trackRecentToolSchema = z.object({ toolId: toolIdSchema });

export type TrackRecentToolInput = z.infer<typeof trackRecentToolSchema>;
