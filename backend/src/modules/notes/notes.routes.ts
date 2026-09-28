import { Router } from "express";
import { z } from "zod";
import { createNoteSchema, updateNoteSchema } from "@devcenter/shared";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";

export const notesRouter = Router();

notesRouter.use(requireAuth);

const listQuerySchema = z.object({
  projectId: z.string().cuid().optional(),
  pinned: z.coerce.boolean().optional(),
});

notesRouter.get(
  "/notes",
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);

    const notes = await prisma.note.findMany({
      where: {
        userId: req.userId,
        ...(query.projectId && { projectId: query.projectId }),
        ...(query.pinned !== undefined && { pinned: query.pinned }),
      },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    });

    res.json(notes);
  }),
);

notesRouter.post(
  "/notes",
  asyncHandler(async (req, res) => {
    const input = createNoteSchema.parse(req.body);

    if (input.projectId) {
      await assertOwnsProject(req.userId!, input.projectId);
    }

    const note = await prisma.note.create({
      data: { ...input, userId: req.userId! },
    });

    res.status(201).json(note);
  }),
);

notesRouter.get(
  "/notes/:id",
  asyncHandler(async (req, res) => {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!note) throw new AppError("NOT_FOUND", "Note not found", 404);

    res.json(note);
  }),
);

notesRouter.patch(
  "/notes/:id",
  asyncHandler(async (req, res) => {
    const input = updateNoteSchema.parse(req.body);

    if (input.projectId) {
      await assertOwnsProject(req.userId!, input.projectId);
    }

    const existing = await prisma.note.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) throw new AppError("NOT_FOUND", "Note not found", 404);

    const note = await prisma.note.update({
      where: { id: existing.id },
      data: input,
    });

    res.json(note);
  }),
);

notesRouter.delete(
  "/notes/:id",
  asyncHandler(async (req, res) => {
    const result = await prisma.note.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (result.count === 0) throw new AppError("NOT_FOUND", "Note not found", 404);

    res.status(204).end();
  }),
);

async function assertOwnsProject(userId: string, projectId: string): Promise<void> {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new AppError("NOT_FOUND", "Project not found", 404);
}
