import { Router } from "express";
import { healthRouter } from "./health.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);

// Los routers de auth/users/tasks/notes/projects/links/activity/tools
// se montan aquí a partir de Fase 2 y Fase 4.
