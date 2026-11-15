import { describe, expect, it } from "vitest";
import { buildSection, type QuestionKind, type ReadingTestDef } from "../prisma/reading/types";
import { ACADEMIC_TESTS } from "../prisma/reading/tests";
import { GENERAL_TESTS } from "../prisma/reading/general";

// Same rule as the frontend's optionValue(): "A. text" -> "A", "iv. x" -> "iv", "TRUE" -> "TRUE".
const optionValue = (o: string) => o.match(/^([A-Za-z]{1,5})\.\s/)?.[1] ?? o;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

function build(test: ReadingTestDef) {
  let next = 1;
  return test.passages.map((p) => {
    const s = buildSection(p, next);
    next += s.questions.length;
    return s;
  });
}

const kindsIn = (tests: ReadingTestDef[]) =>
  new Set(tests.flatMap((t) => t.passages.flatMap((p) => p.groups.map((g) => g.kind))));

describe("Academic test library", () => {
  it("has unique test numbers, all marked Academic", () => {
    const numbers = ACADEMIC_TESTS.map((t) => t.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    for (const t of ACADEMIC_TESTS) expect(t.variant ?? "ACADEMIC").toBe("ACADEMIC");
  });

  it("covers all 11 official IELTS Reading question types", () => {
    const kinds = kindsIn(ACADEMIC_TESTS);
    const official: QuestionKind[] = [
      "Multiple choice", "True/False/Not Given", "Yes/No/Not Given", "Matching information",
      "Matching headings", "Matching features", "Matching sentence endings", "Sentence completion",
      "Summary completion", "Diagram labelling", "Short answer",
    ];
    for (const k of official) expect(kinds, k).toContain(k);
  });
});

describe("General Training test library", () => {
  it("has unique test numbers, all marked General Training", () => {
    const numbers = GENERAL_TESTS.map((t) => t.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    for (const t of GENERAL_TESTS) expect(t.variant).toBe("GENERAL");
  });

  it("covers the question types common in General Training", () => {
    const kinds = kindsIn(GENERAL_TESTS);
    const common: QuestionKind[] = [
      "Multiple choice", "True/False/Not Given", "Yes/No/Not Given", "Matching information",
      "Matching headings", "Matching features", "Sentence completion", "Summary completion",
      "Note completion", "Table completion", "Flow-chart completion", "Short answer",
    ];
    for (const k of common) expect(kinds, k).toContain(k);
  });

  it("follows the General Training layout: Section 1 has 2+ texts, Section 2 has 2 texts", () => {
    for (const t of GENERAL_TESTS) {
      const texts = (p: string) => (p.match(/^TEXT \d+$/gm) ?? []).length;
      expect(texts(t.passages[0].passage), `Test ${t.number} Section 1`).toBeGreaterThanOrEqual(2);
      expect(texts(t.passages[1].passage), `Test ${t.number} Section 2`).toBe(2);
    }
  });
});

const ALL = [
  ...ACADEMIC_TESTS.map((t) => ({ name: `Academic Test ${t.number}`, test: t, words: [2150, 2750] })),
  ...GENERAL_TESTS.map((t) => ({ name: `General Training Test ${t.number}`, test: t, words: [1900, 2750] })),
];

describe.each(ALL)("$name", ({ test, words: [minWords, maxWords] }) => {
  const sections = build(test);
  const questions = sections.flatMap((s) => s.questions);
  const key = Object.assign({}, ...sections.map((s) => s.key));

  it("has exactly 40 questions numbered q1–q40 in order", () => {
    expect(questions.map((q) => q.id)).toEqual(Array.from({ length: 40 }, (_, k) => `q${k + 1}`));
  });

  it("has a total text length within the real exam range", () => {
    const total = test.passages.reduce((n, p) => n + words(p.passage), 0);
    expect(total).toBeGreaterThanOrEqual(minWords);
    expect(total).toBeLessThanOrEqual(maxWords);
  });

  it("has an answer for every question", () => {
    for (const q of questions) {
      const a = key[q.id];
      expect(a, q.id).toBeDefined();
      for (const v of [a].flat()) expect(String(v).trim(), q.id).not.toBe("");
    }
  });

  it("only uses answers that exist among each choice question's options", () => {
    for (const q of questions.filter((q) => q.options)) {
      const values = q.options!.map(optionValue);
      expect(new Set(values).size, `${q.id} has duplicate option values`).toBe(values.length);
      expect(values, q.id).toContain(key[q.id]);
    }
  });

  it("starts every question group with an instruction whose range matches its numbering", () => {
    let n = 1;
    for (const p of test.passages) {
      for (const g of p.groups) {
        const first = questions[n - 1];
        const last = n + g.questions.length - 1;
        expect(first.group, first.id).toBeDefined();
        const expected = n === last ? `Question ${n}` : `Questions ${n}–${last}`;
        expect(first.group!.startsWith(expected), `${first.id}: ${first.group!.split("\n")[0]}`).toBe(true);
        n = last + 1;
      }
    }
  });

  it("keeps written answers within the word limit stated in the instructions", () => {
    const limits: Record<string, number> = { "ONE WORD": 1, "TWO WORDS": 2, "THREE WORDS": 3 };
    let n = 1;
    for (const p of test.passages) {
      for (const g of p.groups) {
        const limit = Object.entries(limits).find(([phrase]) => g.instruction.includes(phrase))?.[1];
        g.questions.forEach((q, qi) => {
          if (limit && !g.options && !q.options) {
            for (const a of [q.answer].flat()) {
              expect(words(a), `q${n + qi} "${a}" exceeds ${limit} word(s)`).toBeLessThanOrEqual(limit);
            }
          }
        });
        n += g.questions.length;
      }
    }
  });

  it("uses only words that appear in the passage for 'from the passage' written answers", () => {
    let n = 1;
    for (const p of test.passages) {
      const text = p.passage.toLowerCase();
      for (const g of p.groups) {
        if (/from (the passage|the text|Text \d)/.test(g.instruction) && !g.options) {
          g.questions.forEach((q, qi) => {
            const accepted = [q.answer].flat();
            const found = accepted.some((a) => text.includes(a.toLowerCase()));
            expect(found, `q${n + qi}: none of ${JSON.stringify(accepted)} appears in the passage`).toBe(true);
          });
        }
        n += g.questions.length;
      }
    }
  });
});
