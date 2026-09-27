import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types/enums.js";

export const taskSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).nullable(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.coerce.date().nullable(),
  projectId: z.string().cuid().nullable(),
  tags: z.array(z.string().min(1).max(40)),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Task = z.infer<typeof taskSchema>;

export const createTaskSchema = taskSchema.pick({
  title: true,
  description: true,
  priority: true,
  dueDate: true,
  projectId: true,
  tags: true,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(TASK_STATUSES).optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
