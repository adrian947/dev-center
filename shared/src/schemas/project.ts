import { z } from "zod";
import { PROJECT_STATUSES } from "../types/enums.js";

export const projectSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(120),
  description: z.string().max(2000).nullable(),
  status: z.enum(PROJECT_STATUSES),
  color: z.string().max(20).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectSchema = projectSchema
  .pick({
    name: true,
    description: true,
    color: true,
  })
  .extend({
    status: z.enum(PROJECT_STATUSES).optional(),
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export interface ProjectWithCounts extends Project {
  taskCount: number;
  openTaskCount: number;
  noteCount: number;
}
