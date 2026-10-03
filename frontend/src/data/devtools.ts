import type { ToolId } from "@devcenter/shared";

export interface DevToolMeta {
  id: ToolId;
  icon: string;
  route?: string;
}

export const DEV_TOOLS: DevToolMeta[] = [
  { id: "json", icon: "pi-code", route: "/devtools/json" },
  { id: "jwt", icon: "pi-key" },
  { id: "uuid", icon: "pi-sparkles", route: "/devtools/uuid" },
  { id: "timestamp", icon: "pi-clock" },
  { id: "base64", icon: "pi-sync", route: "/devtools/base64" },
  { id: "urlEncoder", icon: "pi-link", route: "/devtools/url-encoder" },
  { id: "regex", icon: "pi-filter" },
  { id: "hash", icon: "pi-hashtag" },
  { id: "diff", icon: "pi-clone" },
  { id: "color", icon: "pi-palette" },
  { id: "markdown", icon: "pi-align-left" },
  { id: "sqlFormatter", icon: "pi-database", route: "/devtools/sql-formatter" },
  { id: "cron", icon: "pi-calendar" },
  { id: "http", icon: "pi-globe" },
  { id: "passwordGenerator", icon: "pi-lock" },
  { id: "oneTimeSecret", icon: "pi-eye-slash" },
  { id: "caseConverter", icon: "pi-sort-alpha-down", route: "/devtools/case-converter" },
  { id: "numberBaseConverter", icon: "pi-calculator" },
  { id: "cidrCalculator", icon: "pi-wifi" },
  { id: "userAgentParser", icon: "pi-desktop" },
  { id: "dataFormatConverter", icon: "pi-table", route: "/devtools/data-format" },
  { id: "htmlEntityEscape", icon: "pi-language", route: "/devtools/html-entities" },
  { id: "fakeDataGenerator", icon: "pi-id-card" },
  { id: "qrCode", icon: "pi-qrcode" },
  { id: "colorContrast", icon: "pi-eye" },
  { id: "unitConverter", icon: "pi-arrows-h" },
  { id: "minifierBeautifier", icon: "pi-expand", route: "/devtools/minifier-beautifier" },
  { id: "tokenGenerator", icon: "pi-shield" },
];
