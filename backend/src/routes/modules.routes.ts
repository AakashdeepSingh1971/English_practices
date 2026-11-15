import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../middleware/errorHandler";
import { ModuleTypeSchema } from "../types/enums";

export const modulesRouter = Router();
modulesRouter.use(requireAuth);

const createModuleSchema = z.object({
  title: z.string().min(1),
  type: ModuleTypeSchema,
  order: z.number().int().default(0),
});

// Nested under /api/courses/:courseId/modules
modulesRouter.post(
  "/courses/:courseId/modules",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.courseId } });
    if (!course) return res.status(404).json({ error: "Not found" });
    if (course.createdById !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

    const data = createModuleSchema.parse(req.body);
    const module = await prisma.module.create({
      data: { ...data, courseId: course.id },
    });
    res.status(201).json(module);
  })
);

const updateModuleSchema = z.object({
  title: z.string().min(1).optional(),
  type: ModuleTypeSchema.optional(),
  order: z.number().int().optional(),
});

modulesRouter.put(
  "/modules/:id",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const module = await prisma.module.findUnique({ where: { id: req.params.id }, include: { course: true } });
    if (!module) return res.status(404).json({ error: "Not found" });
    if (module.course.createdById !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

    const data = updateModuleSchema.parse(req.body);
    const updated = await prisma.module.update({ where: { id: req.params.id }, data });
    res.json(updated);
  })
);
