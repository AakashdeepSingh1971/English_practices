import type { TaskQuestion } from "../types/domain";

// "A. Some text" -> "A", "iv. Some heading" -> "iv", "NOT GIVEN" -> "NOT GIVEN".
// The answer key stores this value, so labelled options and bare options both work.
export function optionValue(option: string): string {
  const match = option.match(/^([A-Za-z]{1,5})\.\s/);
  return match ? match[1] : option;
}

// Reading tests use ids q1..q40 so numbering matches the full paper even in a
// single-passage task (Passage 2 starts at 14). Other tasks fall back to position.
export function questionNumber(q: TaskQuestion, fallback: number): number {
  const m = q.id.match(/^q(\d+)$/);
  return m ? Number(m[1]) : fallback;
}

// Show a stored answer value with its option text, e.g. "iv" -> "iv. The dangers of…".
export function describeAnswer(value: string, options?: string[]): string {
  if (!options) return value;
  const match = options.find((o) => optionValue(o).toLowerCase() === value.trim().toLowerCase());
  return match ?? value;
}
