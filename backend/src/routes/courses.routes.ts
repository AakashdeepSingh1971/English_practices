import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../middleware/errorHandler";

export const coursesRouter = Router();
coursesRouter.use(requireAuth);

coursesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    if (req.user!.role === "TEACHER_ADMIN") {
      const courses = await prisma.course.findMany({ where: { createdById: req.user!.id } });
      return res.json(courses);
    }
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.id },
      include: { course: true },
    });
    return res.json(enrollments.map((e) => e.course));
  })
);

const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

coursesRouter.post(
  "/",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const { title, description } = createCourseSchema.parse(req.body);
    const course = await prisma.course.create({
      data: { title, description, createdById: req.user!.id },
    });
    res.status(201).json(course);
  })
);

async function assertCourseAccess(courseId: string, userId: string, role: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("NOT_FOUND");
  if (role === "TEACHER_ADMIN") {
    if (course.createdById !== userId) throw new Error("FORBIDDEN");
  } else {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new Error("FORBIDDEN");
  }
  return course;
}

coursesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      await assertCourseAccess(req.params.id, req.user!.id, req.user!.role);
    } catch (err) {
      if ((err as Error).message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
      throw err;
    }
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: { modules: { orderBy: { order: "asc" }, include: { tasks: { orderBy: { order: "asc" } } } } },
    });
    if (!course) return res.status(404).json({ error: "Not found" });

    // Students never receive answer keys here (not included in this query at all);
    // parse the JSON string columns so the frontend gets structured content, not raw strings.
    const withParsedContent = {
      ...course,
      modules: course.modules.map((module) => ({
        ...module,
        tasks: module.tasks.map(({ contentJson, passCriteria, ...task }) => ({
          ...task,
          content: JSON.parse(contentJson),
          passCriteria: passCriteria ? JSON.parse(passCriteria) : null,
        })),
      })),
    };
    res.json(withParsedContent);
  })
);

const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

coursesRouter.put(
  "/:id",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: "Not found" });
    if (course.createdById !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    const data = updateCourseSchema.parse(req.body);
    const updated = await prisma.course.update({ where: { id: req.params.id }, data });
    res.json(updated);
  })
);

coursesRouter.post(
  "/:id/enroll",
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: "Not found" });
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: req.user!.id, courseId: course.id } },
      update: {},
      create: { userId: req.user!.id, courseId: course.id },
    });
    res.status(201).json(enrollment);
  })
);

coursesRouter.get(
  "/:id/roster",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: "Not found" });
    if (course.createdById !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json(enrollments.map((e) => e.user));
  })
);

coursesRouter.get(
  "/:id/submissions",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: "Not found" });
    if (course.createdById !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

    const submissions = await prisma.submission.findMany({
      where: { task: { module: { courseId: course.id } } },
      include: {
        task: { include: { module: true } },
        user: { select: { id: true, name: true, email: true } },
        grade: true,
        attempt: { include: { violations: true } },
      },
      orderBy: { startedAt: "desc" },
    });
    res.json(submissions);
  })
);
