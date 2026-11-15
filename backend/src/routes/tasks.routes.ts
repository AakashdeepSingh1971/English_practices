import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../middleware/errorHandler";
import { TaskTypeSchema } from "../types/enums";

export const tasksRouter = Router();
tasksRouter.use(requireAuth);

const createTaskSchema = z.object({
  title: z.string().min(1),
  type: TaskTypeSchema,
  order: z.number().int().default(0),
  timeLimitSec: z.number().int().positive().optional(),
  attemptsAllowed: z.number().int().positive().default(1),
  lockdownEnabled: z.boolean().default(false),
  passCriteria: z.record(z.any()).optional(),
  content: z.record(z.any()),
});

async function loadModuleWithOwnerCheck(moduleId: string, userId: string) {
  const module = await prisma.module.findUnique({ where: { id: moduleId }, include: { course: true } });
  if (!module) throw new Error("NOT_FOUND");
  if (module.course.createdById !== userId) throw new Error("FORBIDDEN");
  return module;
}

// Nested under /api/modules/:moduleId/tasks
tasksRouter.post(
  "/modules/:moduleId/tasks",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    let module;
    try {
      module = await loadModuleWithOwnerCheck(req.params.moduleId, req.user!.id);
    } catch (err) {
      if ((err as Error).message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
      if ((err as Error).message === "NOT_FOUND") return res.status(404).json({ error: "Not found" });
      throw err;
    }
    const { content, passCriteria, ...rest } = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        ...rest,
        moduleId: module.id,
        contentJson: JSON.stringify(content),
        passCriteria: passCriteria ? JSON.stringify(passCriteria) : null,
      },
    });
    res.status(201).json({ ...task, content: JSON.parse(task.contentJson) });
  })
);

const updateTaskSchema = createTaskSchema.partial();

tasksRouter.put(
  "/tasks/:id",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: { module: { include: { course: true } } } });
    if (!task) return res.status(404).json({ error: "Not found" });
    if (task.module.course.createdById !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

    const { content, passCriteria, ...rest } = updateTaskSchema.parse(req.body);
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(content ? { contentJson: JSON.stringify(content) } : {}),
        ...(passCriteria ? { passCriteria: JSON.stringify(passCriteria) } : {}),
      },
    });
    res.json({ ...updated, content: JSON.parse(updated.contentJson) });
  })
);

const answerKeySchema = z.object({
  key: z.record(z.union([z.string(), z.array(z.string())])),
});

tasksRouter.put(
  "/tasks/:id/answer-key",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: { module: { include: { course: true } } } });
    if (!task) return res.status(404).json({ error: "Not found" });
    if (task.module.course.createdById !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

    const { key } = answerKeySchema.parse(req.body);
    const answerKey = await prisma.answerKey.upsert({
      where: { taskId: task.id },
      update: { keyJson: JSON.stringify(key) },
      create: { taskId: task.id, keyJson: JSON.stringify(key) },
    });
    res.json({ ...answerKey, key: JSON.parse(answerKey.keyJson) });
  })
);

tasksRouter.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { module: { include: { course: true } } },
    });
    if (!task) return res.status(404).json({ error: "Not found" });

    const isOwner = req.user!.role === "TEACHER_ADMIN" && task.module.course.createdById === req.user!.id;
    if (!isOwner) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: req.user!.id, courseId: task.module.courseId } },
      });
      if (!enrollment) return res.status(403).json({ error: "Forbidden" });
    }

    // Students never receive the answer key, regardless of role check above.
    const { contentJson, passCriteria, ...rest } = task;
    res.json({
      ...rest,
      content: JSON.parse(contentJson),
      passCriteria: passCriteria ? JSON.parse(passCriteria) : null,
    });
  })
);
