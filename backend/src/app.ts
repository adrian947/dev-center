import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { apiRouter } from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use("/api", apiRouter);
  app.use("/api", notFound);

  if (env.NODE_ENV === "production") {
    app.use(express.static(frontendDistPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    });
  }

  app.use(errorHandler);

  return app;
}
