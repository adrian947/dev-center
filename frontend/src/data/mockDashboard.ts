import type { TaskPriority, TaskStatus } from "@devcenter/shared";

export interface DashboardTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectName: string | null;
}

export interface DashboardProject {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
  openTasks: number;
  totalTasks: number;
}

export interface DashboardNote {
  id: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

export interface DashboardTool {
  id: string;
  name: string;
  route: string;
  icon: string;
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const mockTasks: DashboardTask[] = [
  {
    id: "t1",
    title: "Revisar payload JWT del bug de sesión",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: daysFromNow(0),
    projectName: "DevCenter",
  },
  {
    id: "t2",
    title: "Migrar endpoint /api/tasks a paginación cursor",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: daysFromNow(-2),
    projectName: "DevCenter",
  },
  {
    id: "t3",
    title: "Escribir tests E2E de Command Palette",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: daysFromNow(0),
    projectName: "DevCenter",
  },
  {
    id: "t4",
    title: "Actualizar dependencias de seguridad (npm audit)",
    status: "TODO",
    priority: "LOW",
    dueDate: daysFromNow(5),
    projectName: null,
  },
  {
    id: "t5",
    title: "Configurar rate limiting en /api/auth",
    status: "DONE",
    priority: "HIGH",
    dueDate: daysFromNow(-1),
    projectName: "DevCenter",
  },
  {
    id: "t6",
    title: "Documentar variables de entorno de Neon",
    status: "TODO",
    priority: "LOW",
    dueDate: daysFromNow(-4),
    projectName: "Infra personal",
  },
];

export const mockProjects: DashboardProject[] = [
  { id: "p1", name: "DevCenter", status: "ACTIVE", openTasks: 5, totalTasks: 9 },
  { id: "p2", name: "Infra personal", status: "ACTIVE", openTasks: 2, totalTasks: 6 },
  { id: "p3", name: "Blog técnico", status: "PAUSED", openTasks: 1, totalTasks: 4 },
];

export const mockNotes: DashboardNote[] = [];

export const mockTools: DashboardTool[] = [
  { id: "jwt", name: "JWT Decoder", route: "/devtools/jwt", icon: "pi-key" },
  { id: "json", name: "JSON Formatter", route: "/devtools/json", icon: "pi-code" },
  { id: "uuid", name: "UUID Generator", route: "/devtools/uuid", icon: "pi-sparkles" },
  { id: "timestamp", name: "Timestamp", route: "/devtools/timestamp", icon: "pi-clock" },
];

export function isOverdue(task: DashboardTask): boolean {
  if (!task.dueDate || task.status === "DONE") return false;
  return new Date(task.dueDate).setHours(23, 59, 59, 999) < Date.now();
}

export function isDueToday(task: DashboardTask): boolean {
  if (!task.dueDate) return false;
  const due = new Date(task.dueDate);
  const now = new Date();
  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  );
}
