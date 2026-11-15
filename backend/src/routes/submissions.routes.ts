import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../middleware/errorHandler";
import { gradeObjectiveSubmission, isAnswerCorrect } from "../services/grading/objectiveGrading.service";
import type { BandScale } from "../services/grading/bandConversion";
import { OBJECTIVE_MODULE_TYPES, type ModuleTypeValue } from "../types/enums";

export const submissionsRouter = Router();
submissionsRouter.use(requireAuth);

// Grades (when objective) and closes a submission. Shared by explicit submit and
// by the start endpoint when it finds an in-progress attempt whose time ran out.
async function finalizeSubmission(submissionId: string, finalResponseJson: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { task: { include: { module: true, answerKey: true } } },
  });
  if (!submission) throw new Error("NOT_FOUND");
  const { task } = submission;
  const moduleType = task.module.type as ModuleTypeValue;

  let gradingResult: { rawScore: number; band: number } | null = null;
  if (OBJECTIVE_MODULE_TYPES.includes(moduleType) && task.answerKey) {
    const { bandScale } = JSON.parse(task.contentJson) as { bandScale?: BandScale };
    gradingResult = gradeObjectiveSubmission(
      moduleType,
      task.answerKey.keyJson,
      finalResponseJson,
      bandScale === "GENERAL_TRAINING" ? "GENERAL_TRAINING" : "ACADEMIC"
    );
  }

  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: {
      status: gradingResult ? "GRADED" : "SUBMITTED",
      responseJson: finalResponseJson,
      submittedAt: new Date(),
      rawScore: gradingResult?.rawScore,
    },
  });

  await prisma.testAttempt.updateMany({
    where: { submissionId: submission.id, endedAt: null },
    data: { endedAt: new Date() },
  });

  let grade = null;
  if (gradingResult) {
    grade = await prisma.grade.create({
      data: { submissionId: submission.id, band: gradingResult.band, gradedBy: "AUTO" },
    });
  }
  return { submission: updated, grade };
}

function remainingSeconds(startedAt: Date, timeLimitSec: number | null): number | null {
  if (!timeLimitSec) return null;
  return Math.max(0, timeLimitSec - Math.floor((Date.now() - startedAt.getTime()) / 1000));
}

// POST /api/tasks/:id/attempts/start
// Resumes the student's in-progress attempt on this task if there is one (so
// leaving the page mid-test doesn't burn an attempt); otherwise starts a new one.
submissionsRouter.post(
  "/tasks/:id/attempts/start",
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: { module: true } });
    if (!task) return res.status(404).json({ error: "Not found" });

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.user!.id, courseId: task.module.courseId } },
    });
    if (!enrollment) return res.status(403).json({ error: "Forbidden" });

    const inProgress = await prisma.submission.findFirst({
      where: { taskId: task.id, userId: req.user!.id, status: "IN_PROGRESS" },
      include: { attempt: true },
      orderBy: { startedAt: "desc" },
    });
    if (inProgress) {
      const remainingSec = remainingSeconds(inProgress.startedAt, task.timeLimitSec);
      if (remainingSec === 0) {
        await finalizeSubmission(inProgress.id, inProgress.responseJson);
        return res.status(409).json({
          error: "Time ran out on your previous attempt, so your saved answers were submitted.",
          submissionId: inProgress.id,
        });
      }
      return res.json({
        submissionId: inProgress.id,
        attemptId: inProgress.attempt?.id ?? null,
        startedAt: inProgress.startedAt,
        timeLimitSec: task.timeLimitSec,
        remainingSec,
        lockdownEnabled: task.lockdownEnabled,
        resumed: true,
        answers: JSON.parse(inProgress.responseJson).answers ?? {},
      });
    }

    const priorAttempts = await prisma.submission.count({
      where: { taskId: task.id, userId: req.user!.id },
    });
    if (priorAttempts >= task.attemptsAllowed) {
      return res.status(409).json({ error: "No attempts remaining for this task" });
    }

    const submission = await prisma.submission.create({
      data: {
        taskId: task.id,
        userId: req.user!.id,
        responseJson: JSON.stringify({ answers: {} }),
      },
    });

    let attempt = null;
    if (task.lockdownEnabled) {
      attempt = await prisma.testAttempt.create({
        data: { submissionId: submission.id, userId: req.user!.id, lockdownActive: true },
      });
    }

    res.status(201).json({
      submissionId: submission.id,
      attemptId: attempt?.id ?? null,
      startedAt: submission.startedAt,
      timeLimitSec: task.timeLimitSec,
      remainingSec: task.timeLimitSec,
      lockdownEnabled: task.lockdownEnabled,
      resumed: false,
      answers: {},
    });
  })
);

async function loadOwnedSubmission(submissionId: string, userId: string) {
  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) throw new Error("NOT_FOUND");
  if (submission.userId !== userId) throw new Error("FORBIDDEN");
  return submission;
}

const autosaveSchema = z.object({
  responseJson: z.record(z.any()),
});

submissionsRouter.patch(
  "/submissions/:id/autosave",
  asyncHandler(async (req, res) => {
    let submission;
    try {
      submission = await loadOwnedSubmission(req.params.id, req.user!.id);
    } catch (err) {
      if ((err as Error).message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
      return res.status(404).json({ error: "Not found" });
    }
    if (submission.status !== "IN_PROGRESS") {
      return res.status(409).json({ error: "Submission is no longer in progress" });
    }
    const { responseJson } = autosaveSchema.parse(req.body);
    await prisma.submission.update({
      where: { id: submission.id },
      data: { responseJson: JSON.stringify(responseJson) },
    });
    res.status(204).send();
  })
);

const submitSchema = z.object({
  responseJson: z.record(z.any()),
});

submissionsRouter.post(
  "/submissions/:id/submit",
  asyncHandler(async (req, res) => {
    let submission;
    try {
      submission = await loadOwnedSubmission(req.params.id, req.user!.id);
    } catch (err) {
      if ((err as Error).message === "FORBIDDEN") return res.status(403).json({ error: "Forbidden" });
      return res.status(404).json({ error: "Not found" });
    }
    if (submission.status !== "IN_PROGRESS") {
      return res.status(409).json({ error: "Submission is no longer in progress" });
    }

    const { responseJson } = submitSchema.parse(req.body);
    res.json(await finalizeSubmission(submission.id, JSON.stringify(responseJson)));
  })
);

submissionsRouter.get(
  "/submissions/:id",
  asyncHandler(async (req, res) => {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: { task: { include: { module: { include: { course: true } } } }, grade: true, attempt: { include: { violations: true } } },
    });
    if (!submission) return res.status(404).json({ error: "Not found" });

    const isOwner = submission.userId === req.user!.id;
    const isTeacherOwner =
      req.user!.role === "TEACHER_ADMIN" && submission.task.module.course.createdById === req.user!.id;
    if (!isOwner && !isTeacherOwner) return res.status(403).json({ error: "Forbidden" });

    res.json({
      ...submission,
      responseJson: JSON.parse(submission.responseJson),
      grade: submission.grade ? { ...submission.grade, criteriaJson: submission.grade.criteriaJson ? JSON.parse(submission.grade.criteriaJson) : null } : null,
    });
  })
);

const gradeOverrideSchema = z.object({
  band: z.number().min(0).max(9),
  criteriaJson: z.record(z.any()).optional(),
  overrideReason: z.string().min(1),
});

// Manual teacher grade set/override — works whether or not a Grade row already exists,
// so it covers both "override an AI grade" and "manually grade an ungraded Writing/Speaking submission".
submissionsRouter.put(
  "/submissions/:id/grade",
  requireRole("TEACHER_ADMIN"),
  asyncHandler(async (req, res) => {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: { task: { include: { module: { include: { course: true } } } } },
    });
    if (!submission) return res.status(404).json({ error: "Not found" });
    if (submission.task.module.course.createdById !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { band, criteriaJson, overrideReason } = gradeOverrideSchema.parse(req.body);
    const grade = await prisma.grade.upsert({
      where: { submissionId: submission.id },
      update: {
        band,
        criteriaJson: criteriaJson ? JSON.stringify(criteriaJson) : null,
        overriddenByUserId: req.user!.id,
        overrideReason,
      },
      create: {
        submissionId: submission.id,
        band,
        criteriaJson: criteriaJson ? JSON.stringify(criteriaJson) : null,
        gradedBy: "TEACHER",
        overriddenByUserId: req.user!.id,
        overrideReason,
      },
    });
    await prisma.submission.update({ where: { id: submission.id }, data: { status: "GRADED" } });
    res.json(grade);
  })
);

submissionsRouter.get(
  "/students/me/results",
  asyncHandler(async (req, res) => {
    const submissions = await prisma.submission.findMany({
      where: { userId: req.user!.id },
      include: { task: { include: { module: true } }, grade: true },
      orderBy: { startedAt: "desc" },
    });
    res.json(submissions);
  })
);

interface ContentQuestion {
  id: string;
  prompt: string;
  type: string;
  kind?: string;
  options?: string[];
  group?: string;
  figure?: string;
}
interface ContentSection {
  title: string;
  passage: string;
  questions: ContentQuestion[];
}

// GET /api/submissions/:id/review — per-question breakdown for a finished attempt.
// Only available after submission, so it can never leak the answer key mid-test.
submissionsRouter.get(
  "/submissions/:id/review",
  asyncHandler(async (req, res) => {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: {
        task: { include: { answerKey: true, module: { include: { course: true } } } },
        grade: true,
        user: { select: { id: true, name: true } },
      },
    });
    if (!submission) return res.status(404).json({ error: "Not found" });

    const isOwner = submission.userId === req.user!.id;
    const isTeacherOwner =
      req.user!.role === "TEACHER_ADMIN" && submission.task.module.course.createdById === req.user!.id;
    if (!isOwner && !isTeacherOwner) return res.status(403).json({ error: "Forbidden" });
    if (submission.status === "IN_PROGRESS") {
      return res.status(409).json({ error: "This attempt has not been submitted yet" });
    }

    const { task } = submission;
    const content = JSON.parse(task.contentJson) as {
      passage?: string;
      questions?: ContentQuestion[];
      sections?: ContentSection[];
    };
    const sections: ContentSection[] =
      content.sections ?? [{ title: task.title, passage: content.passage ?? "", questions: content.questions ?? [] }];
    const key: Record<string, string | string[]> = task.answerKey ? JSON.parse(task.answerKey.keyJson) : {};
    const answers: Record<string, string> = JSON.parse(submission.responseJson).answers ?? {};

    const byKind = new Map<string, { correct: number; total: number }>();
    let index = 0;
    const reviewSections = sections.map((section) => ({
      title: section.title,
      passage: section.passage,
      questions: section.questions.map((q) => {
        index++;
        const correctAnswer = key[q.id] ?? null;
        const correct = correctAnswer !== null && isAnswerCorrect(answers[q.id], correctAnswer);
        const kind = q.kind ?? (q.type === "MULTIPLE_CHOICE" ? "Multiple choice" : "Short answer");
        const k = byKind.get(kind) ?? { correct: 0, total: 0 };
        k.total++;
        if (correct) k.correct++;
        byKind.set(kind, k);
        const m = q.id.match(/^q(\d+)$/);
        return {
          ...q,
          kind,
          number: m ? Number(m[1]) : index,
          given: answers[q.id] ?? null,
          correctAnswer,
          correct,
        };
      }),
    }));

    const all = reviewSections.flatMap((s) => s.questions);
    res.json({
      submissionId: submission.id,
      taskId: task.id,
      taskTitle: task.title,
      courseId: task.module.courseId,
      moduleTitle: task.module.title,
      studentName: submission.user.name,
      submittedAt: submission.submittedAt,
      startedAt: submission.startedAt,
      score: all.filter((q) => q.correct).length,
      total: all.length,
      band: submission.grade?.band ?? null,
      byKind: [...byKind].map(([kind, v]) => ({ kind, ...v })),
      sections: reviewSections,
    });
  })
);
