import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { coursesRouter } from "./routes/courses.routes";
import { modulesRouter } from "./routes/modules.routes";
import { tasksRouter } from "./routes/tasks.routes";
import { submissionsRouter } from "./routes/submissions.routes";
import { attemptsRouter } from "./routes/attempts.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Behind a hosting proxy (Render, Railway, Fly, nginx…) so req.ip / req.secure are right.
app.set("trust proxy", 1);
app.use(cors({ origin: env.frontendOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api", modulesRouter);
app.use("/api", tasksRouter);
app.use("/api", submissionsRouter);
app.use("/api", attemptsRouter);

// Unknown API routes get JSON, never the app's HTML.
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Single deployment: serve the built React app from the same server and origin.
// Any non-API GET falls back to index.html so client-side routes (/student/...) work on reload.
const indexHtml = path.join(env.staticDir, "index.html");
if (fs.existsSync(indexHtml)) {
  // Hashed build files never change, so browsers may cache them for a year.
  // A missing asset is a plain 404, not the HTML fallback below.
  app.use(
    "/assets",
    express.static(path.join(env.staticDir, "assets"), { immutable: true, maxAge: "1y" }),
    (_req, res) => res.status(404).end()
  );
  app.use(express.static(env.staticDir, { index: false }));
  app.get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(indexHtml);
  });
}

app.use(errorHandler);

export { app };
