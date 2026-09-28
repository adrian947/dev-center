export interface DashboardTool {
  id: string;
  name: string;
  route: string;
  icon: string;
}

export const mockTools: DashboardTool[] = [
  { id: "jwt", name: "JWT Decoder", route: "/devtools/jwt", icon: "pi-key" },
  { id: "json", name: "JSON Formatter", route: "/devtools/json", icon: "pi-code" },
  { id: "uuid", name: "UUID Generator", route: "/devtools/uuid", icon: "pi-sparkles" },
  { id: "timestamp", name: "Timestamp", route: "/devtools/timestamp", icon: "pi-clock" },
];
