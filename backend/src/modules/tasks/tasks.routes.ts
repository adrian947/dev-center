import { Router } from "express";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema, TASK_STATUSES, TASK_PRIORITIES } from "@devcenter/shared";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

const listQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  projectId: z.string().cuid().optional(),
});

tasksRouter.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId,
        ...(query.status && { status: query.status }),
        ...(query.priority && { priority: query.priority }),
        ...(query.projectId && { projectId: query.projectId }),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  }),
);

tasksRouter.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const input = createTaskSchema.parse(req.body);

    if (input.projectId) {
      await assertOwnsProject(req.userId!, input.projectId);
    }

    const task = await prisma.task.create({
      data: { ...input, userId: req.userId! },
    });

    res.status(201).json(task);
  }),
);

tasksRouter.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!task) throw new AppError("NOT_FOUND", "Task not found", 404);

    res.json(task);
  }),
);

tasksRouter.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const input = updateTaskSchema.parse(req.body);

    if (input.projectId) {
      await assertOwnsProject(req.userId!, input.projectId);
    }

    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) throw new AppError("NOT_FOUND", "Task not found", 404);

    const task = await prisma.task.update({
      where: { id: existing.id },
      data: input,
    });

    res.json(task);
  }),
);

tasksRouter.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const result = await prisma.task.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (result.count === 0) throw new AppError("NOT_FOUND", "Task not found", 404);

    res.status(204).end();
  }),
);

async function assertOwnsProject(userId: string, projectId: string): Promise<void> {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new AppError("NOT_FOUND", "Project not found", 404);
}
