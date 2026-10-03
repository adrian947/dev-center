import { Router } from "express";
import { toolIdParamSchema, trackRecentToolSchema } from "@devcenter/shared";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const toolsRouter = Router();

toolsRouter.use(requireAuth);

const RECENT_VISIBLE = 8;
const RECENT_STORED = 20;

toolsRouter.get(
  "/tools/favorites",
  asyncHandler(async (req, res) => {
    const favorites = await prisma.favoriteTool.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      select: { toolId: true },
    });

    res.json(favorites.map((favorite) => favorite.toolId));
  }),
);

toolsRouter.put(
  "/tools/favorites/:toolId",
  asyncHandler(async (req, res) => {
    const { toolId } = toolIdParamSchema.parse(req.params);
    const userId = req.userId!;

    await prisma.favoriteTool.upsert({
      where: { userId_toolId: { userId, toolId } },
      create: { userId, toolId },
      update: {},
    });

    res.status(204).end();
  }),
);

toolsRouter.delete(
  "/tools/favorites/:toolId",
  asyncHandler(async (req, res) => {
    const { toolId } = toolIdParamSchema.parse(req.params);

    await prisma.favoriteTool.deleteMany({ where: { userId: req.userId, toolId } });

    res.status(204).end();
  }),
);

toolsRouter.get(
  "/tools/recent",
  asyncHandler(async (req, res) => {
    const recents = await prisma.recentTool.findMany({
      where: { userId: req.userId },
      orderBy: { lastUsedAt: "desc" },
      take: RECENT_VISIBLE,
      select: { toolId: true, lastUsedAt: true, useCount: true },
    });

    res.json(recents);
  }),
);

toolsRouter.post(
  "/tools/recent",
  asyncHandler(async (req, res) => {
    const { toolId } = trackRecentToolSchema.parse(req.body);
    const userId = req.userId!;

    await prisma.recentTool.upsert({
      where: { userId_toolId: { userId, toolId } },
      create: { userId, toolId },
      update: { lastUsedAt: new Date(), useCount: { increment: 1 } },
    });

    const stale = await prisma.recentTool.findMany({
      where: { userId },
      orderBy: { lastUsedAt: "desc" },
      skip: RECENT_STORED,
      select: { id: true },
    });

    if (stale.length > 0) {
      await prisma.recentTool.deleteMany({ where: { id: { in: stale.map((row) => row.id) } } });
    }

    res.status(204).end();
  }),
);
