/**
 * Review IELTS Reading submissions question by question.
 *
 *   npm run review:reading                 latest submitted reading attempt
 *   npm run review:reading -- <submissionId>
 *   npm run review:reading -- --all        list every reading submission
 *   npm run review:reading -- --stats      accuracy by question type across all attempts
 *
 * Matching mirrors the auto-grader (trimmed, case-insensitive, extra spaces ignored).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const args = process.argv.slice(2);

type Key = Record<string, string | string[]>;
interface Q {
  id: string;
  prompt: string;
  kind?: string;
}

const norm = (v: string) => v.trim().replace(/\s+/g, " ").toLowerCase();
const isCorrect = (given: string | undefined, correct: string | string[]) =>
  given != null && given.trim() !== "" && [correct].flat().some((c) => norm(c) === norm(given));

const readingWhere = { status: { not: "IN_PROGRESS" }, task: { module: { type: "READING" } } };

async function loadSubmissions(id?: string) {
  return prisma.submission.findMany({
    where: id ? { id } : readingWhere,
    include: { task: { include: { answerKey: true } }, grade: true, user: true },
    orderBy: { submittedAt: "desc" },
  });
}

type Sub = Awaited<ReturnType<typeof loadSubmissions>>[number];

function rows(sub: Sub) {
  const content = JSON.parse(sub.task.contentJson);
  const questions: Q[] = content.sections
    ? content.sections.flatMap((s: { questions: Q[] }) => s.questions)
    : content.questions;
  const key: Key = sub.task.answerKey ? JSON.parse(sub.task.answerKey.keyJson) : {};
  const answers: Record<string, string> = JSON.parse(sub.responseJson).answers ?? {};
  return questions.map((q) => ({
    num: q.id.replace(/^q/, ""),
    kind: q.kind ?? "—",
    prompt: q.prompt,
    given: answers[q.id],
    correct: key[q.id],
    ok: key[q.id] !== undefined && isCorrect(answers[q.id], key[q.id]),
  }));
}

function printOne(sub: Sub) {
  const r = rows(sub);
  const score = r.filter((x) => x.ok).length;
  console.log(`\n${sub.task.title}`);
  console.log(
    `Student: ${sub.user.name} | Submitted: ${sub.submittedAt?.toISOString() ?? "—"} | Score: ${score}/${r.length} | Band: ${sub.grade?.band ?? "—"} | id: ${sub.id}\n`
  );
  for (const x of r) {
    const given = x.given?.trim() ? x.given : "(blank)";
    const correct = [x.correct].flat().join(" / ");
    console.log(
      `${x.ok ? "✓" : "✗"} Q${x.num.padEnd(3)} [${x.kind}] ${x.prompt.slice(0, 70)}\n      yours: ${given}${x.ok ? "" : `   correct: ${correct}`}`
    );
  }
  const byKind = new Map<string, { ok: number; n: number }>();
  for (const x of r) {
    const k = byKind.get(x.kind) ?? { ok: 0, n: 0 };
    k.n++;
    if (x.ok) k.ok++;
    byKind.set(x.kind, k);
  }
  console.log("\nBy question type:");
  for (const [k, v] of byKind) console.log(`  ${k.padEnd(28)} ${v.ok}/${v.n}`);
}

async function main() {
  if (args.includes("--all")) {
    for (const s of await loadSubmissions()) {
      const r = rows(s);
      console.log(
        `${s.submittedAt?.toISOString().slice(0, 16)}  ${String(r.filter((x) => x.ok).length).padStart(2)}/${r.length}  band ${s.grade?.band ?? "—"}  ${s.task.title}  (${s.id})`
      );
    }
    return;
  }
  if (args.includes("--stats")) {
    const totals = new Map<string, { ok: number; n: number }>();
    const subs = await loadSubmissions();
    for (const s of subs)
      for (const x of rows(s)) {
        const t = totals.get(x.kind) ?? { ok: 0, n: 0 };
        t.n++;
        if (x.ok) t.ok++;
        totals.set(x.kind, t);
      }
    console.log(`Accuracy by question type across ${subs.length} submission(s), weakest first:`);
    [...totals]
      .sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n)
      .forEach(([k, v]) => console.log(`  ${k.padEnd(28)} ${v.ok}/${v.n}  (${Math.round((100 * v.ok) / v.n)}%)`));
    return;
  }
  const id = args.find((a) => !a.startsWith("--"));
  const [sub] = await loadSubmissions(id);
  if (!sub) {
    console.log(id ? `No submission ${id}.` : "No submitted reading attempts yet.");
    return;
  }
  printOne(sub);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
