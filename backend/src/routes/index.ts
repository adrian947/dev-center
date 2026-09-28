import { Router } from "express";
import { healthRouter } from "./health.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { tasksRouter } from "../modules/tasks/tasks.routes.js";
import { notesRouter } from "../modules/notes/notes.routes.js";
import { projectsRouter } from "../modules/projects/projects.routes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);
apiRouter.use(tasksRouter);
apiRouter.use(notesRouter);
apiRouter.use(projectsRouter);

// Los routers de links/activity/tools se montan aquí en una fase posterior.
