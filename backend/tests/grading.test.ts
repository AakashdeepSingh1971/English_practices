import { describe, expect, it } from "vitest";
import { rawScoreToBand } from "../src/services/grading/bandConversion";
import { gradeObjectiveSubmission, isAnswerCorrect } from "../src/services/grading/objectiveGrading.service";

const key40 = JSON.stringify(Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`q${i + 1}`, "A"])));
const answers = (correct: number, total = 40) =>
  JSON.stringify({
    answers: Object.fromEntries(Array.from({ length: total }, (_, i) => [`q${i + 1}`, i < correct ? "A" : "B"])),
  });

describe("rawScoreToBand (Academic Reading)", () => {
  it.each([
    [40, 9], [39, 9], [38, 8.5], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [29, 6.5],
    [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [9, 0], [0, 0],
  ])("%i/40 → band %f", (raw, band) => {
    expect(rawScoreToBand("READING", raw)).toBe(band);
  });

  it("uses the separate Listening table", () => {
    expect(rawScoreToBand("LISTENING", 32)).toBe(7.5);
    expect(rawScoreToBand("READING", 32)).toBe(7);
  });
});

describe("rawScoreToBand (General Training Reading)", () => {
  it.each([
    [40, 9], [39, 8.5], [38, 8], [37, 8], [36, 7.5], [35, 7], [34, 7], [33, 6.5], [32, 6.5],
    [30, 6], [27, 5.5], [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5], [5, 0], [0, 0],
  ])("%i/40 → band %f", (raw, band) => {
    expect(rawScoreToBand("READING", raw, "GENERAL_TRAINING")).toBe(band);
  });

  it("needs more correct answers than Academic for the same band", () => {
    expect(rawScoreToBand("READING", 30)).toBe(7);
    expect(rawScoreToBand("READING", 30, "GENERAL_TRAINING")).toBe(6);
  });

  it("is used when grading a General Training submission", () => {
    expect(gradeObjectiveSubmission("READING", key40, answers(30), "GENERAL_TRAINING").band).toBe(6);
    expect(gradeObjectiveSubmission("READING", key40, answers(30)).band).toBe(7);
  });
});

describe("isAnswerCorrect", () => {
  it("ignores case, surrounding and repeated whitespace", () => {
    expect(isAnswerCorrect("  Social   JET lag ", "social jet lag")).toBe(true);
  });
  it("accepts any listed alternative", () => {
    expect(isAnswerCorrect("20", ["twenty", "20"])).toBe(true);
    expect(isAnswerCorrect("twenty", ["twenty", "20"])).toBe(true);
  });
  it("treats blank and missing answers as wrong", () => {
    expect(isAnswerCorrect("", "A")).toBe(false);
    expect(isAnswerCorrect("   ", "A")).toBe(false);
    expect(isAnswerCorrect(undefined, "A")).toBe(false);
    expect(isAnswerCorrect(null, "A")).toBe(false);
  });
  it("does not accept partial matches", () => {
    expect(isAnswerCorrect("course", ["training course", "a training course"])).toBe(false);
    expect(isAnswerCorrect("NOT", "NOT GIVEN")).toBe(false);
  });
});

describe("gradeObjectiveSubmission", () => {
  it("grades a full 40-question paper directly", () => {
    expect(gradeObjectiveSubmission("READING", key40, answers(30))).toEqual({ rawScore: 30, totalQuestions: 40, band: 7 });
  });

  it("scales a single 13-question passage to the 40-question table", () => {
    const key13 = JSON.stringify(Object.fromEntries(Array.from({ length: 13 }, (_, i) => [`q${i + 14}`, "x"])));
    const all = JSON.stringify({ answers: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [`q${i + 14}`, "x"])) });
    expect(gradeObjectiveSubmission("READING", key13, all)).toMatchObject({ rawScore: 13, band: 9 });
    // 7/13 → round(21.5) = 22/40 → band 5.5
    const seven = JSON.stringify({ answers: Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`q${i + 14}`, "x"])) });
    expect(gradeObjectiveSubmission("READING", key13, seven)).toMatchObject({ rawScore: 7, band: 5.5 });
  });

  it("ignores answers to questions that are not in the key", () => {
    const res = gradeObjectiveSubmission("READING", key40, JSON.stringify({ answers: { q1: "A", q99: "A" } }));
    expect(res.rawScore).toBe(1);
  });

  it("handles a response with no answers object", () => {
    expect(gradeObjectiveSubmission("READING", key40, JSON.stringify({})).rawScore).toBe(0);
  });
});
