/**
 * Seeds IELTS Reading practice tests into the teacher's "IELTS Preparation" course.
 * Each test becomes one module with 3 single-section practice tasks and a full
 * 60-minute, 40-question mock test. All texts are original writing.
 *
 *   npm run seed:reading                  General Training tests (the course default)
 *   npm run seed:reading -- --academic    Academic tests instead
 *   npm run seed:reading -- --both        both kinds side by side
 *   npm run seed:reading -- --force       also replace tests that have submissions (deletes them!)
 *
 * Tests of the kind not being seeded are removed from the course, unless they
 * have submissions (then they are kept, and --force removes them too).
 *
 * Needs a teacher account: the dev seed's teacher by default, or set
 * TEACHER_EMAIL=you@example.com (see create-teacher.ts). The teacher's
 * "IELTS Preparation" course is created if it doesn't exist.
 */
import { PrismaClient } from "@prisma/client";
import { buildSection, type BuiltSection, type ReadingTestDef, type ReadingVariant } from "./reading/types";
import { ACADEMIC_TESTS } from "./reading/tests";
import { GENERAL_TESTS } from "./reading/general";

const prisma = new PrismaClient();
const FORCE = process.argv.includes("--force");
const SEED: ReadingVariant[] = process.argv.includes("--both")
  ? ["GENERAL", "ACADEMIC"]
  : process.argv.includes("--academic")
    ? ["ACADEMIC"]
    : ["GENERAL"];

interface VariantInfo {
  name: string;
  part: string; // what one of the three texts is called
  tests: ReadingTestDef[];
  orderBase: number;
  bandScale: "ACADEMIC" | "GENERAL_TRAINING";
  mockInstructions: string;
  partInstructions: (part: number, first: string, last: string) => string;
}

const VARIANTS: Record<ReadingVariant, VariantInfo> = {
  GENERAL: {
    name: "General Training Reading",
    part: "Section",
    tests: GENERAL_TESTS,
    orderBase: 10,
    bandScale: "GENERAL_TRAINING",
    mockInstructions:
      "This test has three sections and 40 questions. Section 1 contains short everyday texts, Section 2 contains work-related texts, and Section 3 contains one longer text on a topic of general interest. You have 60 minutes. There is no extra time to transfer answers. Spelling must be correct for written answers.",
    partInstructions: (part, first, last) =>
      `Practice: spend about 20 minutes on Questions ${first}–${last}, based on Section ${part}. Your band is estimated with the General Training table by scaling your score to a 40-question paper.`,
  },
  ACADEMIC: {
    name: "Academic Reading",
    part: "Passage",
    tests: ACADEMIC_TESTS,
    orderBase: 20,
    bandScale: "ACADEMIC",
    mockInstructions:
      "This test has three reading passages and 40 questions. You have 60 minutes. There is no extra time to transfer answers. Spelling must be correct for written answers.",
    partInstructions: (part, first, last) =>
      `Practice: spend about 20 minutes on Questions ${first}–${last}, based on Reading Passage ${part}. Your band is estimated by scaling your score to a 40-question paper.`,
  },
};

const moduleTitle = (v: ReadingVariant, n: number) => `${VARIANTS[v].name} — Practice Test ${n}`;

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

async function seedTest(courseId: string, variant: ReadingVariant, test: ReadingTestDef): Promise<string> {
  const info = VARIANTS[variant];
  const label = `${info.name} Test ${test.number}`;
  const title = moduleTitle(variant, test.number);
  const existing = await prisma.module.findFirst({ where: { courseId, title } });
  if (existing) {
    const submissions = await prisma.submission.count({ where: { task: { moduleId: existing.id } } });
    if (submissions > 0 && !FORCE) return `${label}: kept (${submissions} submission(s) exist)`;
    await deleteModuleCascade(existing.id);
  }

  const module = await prisma.module.create({
    data: { courseId, title, type: "READING", order: info.orderBase + test.number },
  });

  let next = 1;
  const sections = test.passages.map((p) => {
    const s = buildSection(p, next);
    next += s.questions.length;
    return s;
  });
  if (next - 1 !== 40) throw new Error(`${label}: expected 40 questions, built ${next - 1}`);

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
          bandScale: info.bandScale,
          sectionLabel: info.part,
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
      title: `T${test.number} ${info.part} ${i + 1} — ${test.passages[i].shortTitle} (Q${first}–${last})`,
      order: i + 1,
      timeLimitSec: 20 * 60,
      attemptsAllowed: 99,
      lockdownEnabled: false,
      instructions: info.partInstructions(i + 1, first, last),
      sections: [s],
    });
  }

  await createTask({
    title: `T${test.number} Full Mock Test — ${info.name} (40 questions, 60 minutes)`,
    order: 4,
    timeLimitSec: 60 * 60,
    attemptsAllowed: 3,
    lockdownEnabled: true,
    instructions: info.mockInstructions,
    sections,
  });

  return `${label}: ${existing ? "refreshed" : "added"}`;
}

async function main() {
  for (const v of SEED) {
    if (VARIANTS[v].tests.some((t) => (t.variant ?? "ACADEMIC") !== v)) {
      throw new Error(`A test in the ${VARIANTS[v].name} list has the wrong variant`);
    }
  }

  // TEACHER_EMAIL picks the teacher who owns the practice course (defaults to the
  // dev seed's teacher). The course is created if that teacher doesn't have one.
  const teacherEmail = process.env.TEACHER_EMAIL ?? "teacher@example.com";
  const teacher = await prisma.user.findUnique({ where: { email: teacherEmail } });
  if (!teacher || teacher.role !== "TEACHER_ADMIN") {
    throw new Error(
      `No teacher ${teacherEmail}. Run "npm run seed" (development) or "npm run create-teacher" (production) first.`
    );
  }
  const description = `${SEED.map((v) => VARIANTS[v].name).join(" and ")} practice tests: timed sections and full mock tests with answer review.`;
  const found = await prisma.course.findFirst({
    where: { createdById: teacher.id, title: "IELTS Preparation" },
    orderBy: { createdAt: "asc" },
  });
  const course = found
    ? await prisma.course.update({ where: { id: found.id }, data: { description } })
    : await prisma.course.create({ data: { title: "IELTS Preparation", description, createdById: teacher.id } });

  // Older versions of this script used an unnumbered title for Academic Test 1.
  const legacy = await prisma.module.findFirst({
    where: { courseId: course.id, title: "Academic Reading — Practice Test 1", order: 5 },
  });
  if (legacy) {
    const n = await prisma.submission.count({ where: { task: { moduleId: legacy.id } } });
    if (n > 0 && !FORCE) throw new Error("Legacy Test 1 module has submissions; re-run with --force to replace it.");
    await deleteModuleCascade(legacy.id);
  }

  // Remove practice tests of the kind not being seeded.
  for (const v of (Object.keys(VARIANTS) as ReadingVariant[]).filter((v) => !SEED.includes(v))) {
    const stale = await prisma.module.findMany({
      where: { courseId: course.id, title: { startsWith: `${VARIANTS[v].name} — Practice Test` } },
    });
    for (const m of stale) {
      const n = await prisma.submission.count({ where: { task: { moduleId: m.id } } });
      if (n > 0 && !FORCE) {
        console.log(`${m.title}: kept (${n} submission(s) exist; --force removes it)`);
        continue;
      }
      await deleteModuleCascade(m.id);
      console.log(`${m.title}: removed`);
    }
  }

  for (const v of SEED) {
    for (const test of VARIANTS[v].tests) console.log(await seedTest(course.id, v, test));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
