/**
 * Seeds IELTS Academic Reading practice tests from prisma/reading/tests.
 * Each test becomes one module with 3 single-passage practice tasks and a
 * full 60-minute, 40-question mock test. All passages are original writing.
 *
 *   npm run seed:reading            add new tests; refresh tests nobody has taken yet
 *   npm run seed:reading -- --force also replace tests that have submissions (deletes them!)
 *
 * Requires `npm run seed` first (sample teacher + "IELTS Preparation" course).
 */
import { PrismaClient } from "@prisma/client";
import { buildSection, type BuiltSection, type ReadingTestDef } from "./reading/types";
import { READING_TESTS } from "./reading/tests";

const prisma = new PrismaClient();
const FORCE = process.argv.includes("--force");

const moduleTitle = (n: number) => `Academic Reading — Practice Test ${n}`;

async function deleteModuleCascade(moduleId: string) {
  const tasks = await prisma.task.findMany({ where: { moduleId }, select: { id: true } });
  const taskIds = tasks.map((t) => t.id);
  await prisma.$transaction([
    prisma.violation.deleteMany({ where: { testAttempt: { submission: { taskId: { in: taskIds } } } } }),
    prisma.testAttempt.deleteMany({ where: { submission: { taskId: { in: taskIds } } } }),
    prisma.grade.deleteMany({ where: { submission: { taskId: { in: taskIds } } } }),
    prisma.submission.deleteMany({ where: { taskId: { in: taskIds } } }),
    prisma.answerKey.deleteMany({ where: { taskId: { in: taskIds } } }),
    prisma.task.deleteMany({ where: { moduleId } }),
    prisma.module.delete({ where: { id: moduleId } }),
  ]);
}

async function seedTest(courseId: string, test: ReadingTestDef): Promise<string> {
  const title = moduleTitle(test.number);
  const existing = await prisma.module.findFirst({ where: { courseId, title } });
  if (existing) {
    const submissions = await prisma.submission.count({ where: { task: { moduleId: existing.id } } });
    if (submissions > 0 && !FORCE) return `Test ${test.number}: kept (${submissions} submission(s) exist)`;
    await deleteModuleCascade(existing.id);
  }

  const module = await prisma.module.create({
    data: { courseId, title, type: "READING", order: 10 + test.number },
  });

  let next = 1;
  const sections = test.passages.map((p) => {
    const s = buildSection(p, next);
    next += s.questions.length;
    return s;
  });
  if (next - 1 !== 40) throw new Error(`Test ${test.number}: expected 40 questions, built ${next - 1}`);

  const createTask = async (opts: {
    title: string;
    order: number;
    timeLimitSec: number;
    attemptsAllowed: number;
    lockdownEnabled: boolean;
    instructions: string;
    sections: BuiltSection[];
  }) => {
    const task = await prisma.task.create({
      data: {
        moduleId: module.id,
        title: opts.title,
        type: "MULTIPLE_CHOICE",
        order: opts.order,
        timeLimitSec: opts.timeLimitSec,
        attemptsAllowed: opts.attemptsAllowed,
        lockdownEnabled: opts.lockdownEnabled,
        contentJson: JSON.stringify({
          instructions: opts.instructions,
          questions: [],
          sections: opts.sections.map(({ key: _key, ...s }) => s),
        }),
      },
    });
    const key = Object.assign({}, ...opts.sections.map((s) => s.key));
    await prisma.answerKey.create({ data: { taskId: task.id, keyJson: JSON.stringify(key) } });
  };

  for (const [i, s] of sections.entries()) {
    const first = s.questions[0].id.slice(1);
    const last = s.questions[s.questions.length - 1].id.slice(1);
    await createTask({
      title: `T${test.number} Passage ${i + 1} — ${test.passages[i].shortTitle} (Q${first}–${last})`,
      order: i + 1,
      timeLimitSec: 20 * 60,
      attemptsAllowed: 99,
      lockdownEnabled: false,
      instructions: `Practice: spend about 20 minutes on Questions ${first}–${last}, based on Reading Passage ${i + 1}. Your band is estimated by scaling your score to a 40-question paper.`,
      sections: [s],
    });
  }

  await createTask({
    title: `T${test.number} Full Mock Test — Academic Reading (40 questions, 60 minutes)`,
    order: 4,
    timeLimitSec: 60 * 60,
    attemptsAllowed: 3,
    lockdownEnabled: true,
    instructions:
      "This test has three reading passages and 40 questions. You have 60 minutes. There is no extra time to transfer answers. Spelling must be correct for written answers.",
    sections,
  });

  return `Test ${test.number}: ${existing ? "refreshed" : "added"}`;
}

async function main() {
  const teacher = await prisma.user.findUnique({ where: { email: "teacher@example.com" } });
  const course = teacher
    ? await prisma.course.findFirst({
        where: { createdById: teacher.id, title: "IELTS Preparation" },
        orderBy: { createdAt: "asc" },
      })
    : null;
  if (!course) throw new Error('Sample course not found — run "npm run seed" first.');

  // Older versions of this script used an unnumbered title for Test 1.
  const legacy = await prisma.module.findFirst({
    where: { courseId: course.id, title: "Academic Reading — Practice Test 1", order: 5 },
  });
  if (legacy) {
    const n = await prisma.submission.count({ where: { task: { moduleId: legacy.id } } });
    if (n > 0 && !FORCE) throw new Error("Legacy Test 1 module has submissions; re-run with --force to replace it.");
    await deleteModuleCascade(legacy.id);
  }

  for (const test of READING_TESTS) console.log(await seedTest(course.id, test));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
