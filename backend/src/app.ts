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

app.use(errorHandler);

export { app };
