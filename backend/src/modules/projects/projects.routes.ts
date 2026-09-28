import { Router } from "express";
import { createProjectSchema, updateProjectSchema, type ProjectWithCounts } from "@devcenter/shared";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get(
  "/projects",
  asyncHandler(async (req, res) => {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      include: { _count: { select: { tasks: true, notes: true } } },
      orderBy: { createdAt: "desc" },
    });

    const openCounts = await prisma.task.groupBy({
      by: ["projectId"],
      where: {
        userId: req.userId,
        status: { not: "DONE" },
        projectId: { in: projects.map((p) => p.id) },
      },
      _count: { _all: true },
    });

    const openByProject = new Map(openCounts.map((row) => [row.projectId, row._count._all]));

    const withCounts: ProjectWithCounts[] = projects.map(({ _count, ...project }) => ({
      ...project,
      taskCount: _count.tasks,
      noteCount: _count.notes,
      openTaskCount: openByProject.get(project.id) ?? 0,
    }));

    res.json(withCounts);
  }),
);

projectsRouter.post(
  "/projects",
  asyncHandler(async (req, res) => {
    const input = createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: { ...input, userId: req.userId! },
    });

    res.status(201).json(project);
  }),
);

projectsRouter.get(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!project) throw new AppError("NOT_FOUND", "Project not found", 404);

    res.json(project);
  }),
);

projectsRouter.patch(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const input = updateProjectSchema.parse(req.body);

    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) throw new AppError("NOT_FOUND", "Project not found", 404);

    const project = await prisma.project.update({
      where: { id: existing.id },
      data: input,
    });

    res.json(project);
  }),
);

projectsRouter.delete(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const result = await prisma.project.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (result.count === 0) throw new AppError("NOT_FOUND", "Project not found", 404);

    res.status(204).end();
  }),
);
