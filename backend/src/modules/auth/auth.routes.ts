import { Router } from "express";
import type { User } from "@prisma/client";
import { passport } from "./passport.js";
import { env } from "../../config/env.js";
import { prisma } from "../../db/prisma.js";
import { signAccessToken } from "../../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../../utils/authCookie.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { AuthUser } from "@devcenter/shared";

export const authRouter = Router();

function toAuthUser(user: User): AuthUser {
  return { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl };
}

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/login?error=oauth`,
  }),
  (req, res) => {
    const user = req.user as User;
    const token = signAccessToken(user.id);
    setAuthCookie(res, token);
    res.redirect(env.FRONTEND_URL);
  },
);

authRouter.post("/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

authRouter.get(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });

    if (!user) {
      clearAuthCookie(res);
      res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Session invalid" } });
      return;
    }

    res.json(toAuthUser(user));
  }),
);
