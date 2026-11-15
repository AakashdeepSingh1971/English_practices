import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { ViolationTypeSchema } from "../types/enums";

export const attemptsRouter = Router();
attemptsRouter.use(requireAuth);

const MAX_VIOLATIONS_BEFORE_AUTO_SUBMIT = 2;

async function loadAttemptWithAccess(attemptId: string, userId: string, role: string) {
  const attempt = await prisma.testAttempt.findUnique({
    where: { id: attemptId },
    include: { submission: { include: { task: { include: { module: { include: { course: true } } } } } }, violations: true },
  });
  if (!attempt) throw new Error("NOT_FOUND");
  const isOwner = attempt.userId === userId;
  const isTeacherOwner = role === "TEACHER_ADMIN" && attempt.submission.task.module.course.createdById === userId;
  if (!isOwner && !isTeacherOwner) throw new Error("FORBIDDEN");
  return attempt;
}

attemptsRouter.get(
  "/attempts/:id",
  asyncHandler(async (req, res) => {
    let attempt;
    try {
      attempt = await loadAttemptWithAccess(req.params.id, req.user!.id, req.user!.role);
    } catch (err) {
      if ((err as Error).message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ ...attempt, violationCount: attempt.violations.length });
  })
);

attemptsRouter.get(
  "/attempts/:id/violations",
  asyncHandler(async (req, res) => {
    let attempt;
    try {
      attempt = await loadAttemptWithAccess(req.params.id, req.user!.id, req.user!.role);
    } catch (err) {
      if ((err as Error).message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
      return res.status(404).json({ error: "Not found" });
    }
    res.json(attempt.violations);
  })
);

const violationSchema = z.object({
  type: ViolationTypeSchema,
});

attemptsRouter.post(
  "/attempts/:id/violations",
  asyncHandler(async (req, res) => {
    const attempt = await prisma.testAttempt.findUnique({ where: { id: req.params.id } });
    if (!attempt) return res.status(404).json({ error: "Not found" });
    if (attempt.userId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    if (attempt.endedAt) return res.status(409).json({ error: "This test has already ended" });

    const { type } = violationSchema.parse(req.body);
    await prisma.violation.create({ data: { testAttemptId: attempt.id, type } });
    const violationCount = await prisma.violation.count({ where: { testAttemptId: attempt.id } });

    res.json({
      violationCount,
      shouldAutoSubmit: violationCount >= MAX_VIOLATIONS_BEFORE_AUTO_SUBMIT,
    });
  })
);

attemptsRouter.post(
  "/attempts/:id/force-submit",
  asyncHandler(async (req, res) => {
    const attempt = await prisma.testAttempt.findUnique({ where: { id: req.params.id }, include: { submission: true } });
    if (!attempt) return res.status(404).json({ error: "Not found" });
    if (attempt.userId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
    if (attempt.endedAt) return res.json({ submissionId: attempt.submissionId });

    await prisma.testAttempt.update({
      where: { id: attempt.id },
      data: { endedAt: new Date(), autoSubmitted: true },
    });
    // The actual submission grading still goes through POST /submissions/:id/submit —
    // this endpoint only flags the attempt; the frontend calls submit right after.
    res.json({ submissionId: attempt.submissionId });
  })
);
