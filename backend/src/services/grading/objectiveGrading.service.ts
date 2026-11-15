import { rawScoreToBand, type BandScale } from "./bandConversion";
import type { ModuleTypeValue } from "../../types/enums";

// AnswerKey.keyJson shape: { [questionId: string]: string | string[] }
// (an array means any of those values is accepted as correct)
type AnswerKeyMap = Record<string, string | string[]>;

// Submission.responseJson shape for objective tasks: { answers: { [questionId: string]: string } }
interface ObjectiveResponse {
  answers: Record<string, string>;
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

// Shared by the grader and the answer-review endpoint so both always agree.
export function isAnswerCorrect(given: string | null | undefined, correct: string | string[]): boolean {
  if (given == null || given.trim() === "") return false;
  const acceptable = Array.isArray(correct) ? correct : [correct];
  return acceptable.some((option) => normalize(option) === normalize(given));
}

export interface ObjectiveGradingResult {
  rawScore: number;
  totalQuestions: number;
  band: number;
}

export function gradeObjectiveSubmission(
  moduleType: ModuleTypeValue,
  keyJson: string,
  responseJson: string,
  scale: BandScale = "ACADEMIC"
): ObjectiveGradingResult {
  const answerKey: AnswerKeyMap = JSON.parse(keyJson);
  const response: ObjectiveResponse = JSON.parse(responseJson);

  const questionIds = Object.keys(answerKey);
  let rawScore = 0;

  for (const questionId of questionIds) {
    if (isAnswerCorrect(response.answers?.[questionId], answerKey[questionId])) rawScore += 1;
  }

  // Band tables are defined for a full 40-question paper. For shorter practice
  // tasks (e.g. a single 13-question passage), scale to the 40-question equivalent.
  const FULL_TEST_QUESTIONS = 40;
  const scaled =
    questionIds.length > 0 && questionIds.length !== FULL_TEST_QUESTIONS
      ? Math.round((rawScore / questionIds.length) * FULL_TEST_QUESTIONS)
      : rawScore;
  const band = rawScoreToBand(moduleType, scaled, scale);

  return { rawScore, totalQuestions: questionIds.length, band };
}
