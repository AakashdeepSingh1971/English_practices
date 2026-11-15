// Shared shapes for IELTS Academic Reading practice tests.
// Each test file in ./tests exports a ReadingTestDef; seed-reading.ts loads them all.

export type Answer = string | string[];

export type QuestionKind =
  | "Multiple choice"
  | "True/False/Not Given"
  | "Yes/No/Not Given"
  | "Matching information"
  | "Matching headings"
  | "Matching features"
  | "Matching sentence endings"
  | "Sentence completion"
  | "Summary completion"
  | "Note completion"
  | "Table completion"
  | "Flow-chart completion"
  | "Diagram labelling"
  | "Short answer";

export interface QuestionDef {
  prompt: string;
  answer: Answer;
  options?: string[];
}

export interface GroupDef {
  kind: QuestionKind;
  // "{range}" is replaced with e.g. "Questions 1–5".
  instruction: string;
  figure?: string;
  // Shared options for every question in the group (matching / TFNG / word box).
  options?: string[];
  questions: QuestionDef[];
}

export interface PassageDef {
  title: string;
  shortTitle: string;
  passage: string;
  groups: GroupDef[];
}

export interface ReadingTestDef {
  number: number;
  passages: [PassageDef, PassageDef, PassageDef];
}

export const TFNG = ["TRUE", "FALSE", "NOT GIVEN"];
export const YNNG = ["YES", "NO", "NOT GIVEN"];

export const TFNG_INSTRUCTION = (passageNo: number) =>
  `{range}\nDo the following statements agree with the information given in Reading Passage ${passageNo}?\n\nTRUE — if the statement agrees with the information\nFALSE — if the statement contradicts the information\nNOT GIVEN — if there is no information on this`;

export const YNNG_INSTRUCTION = (passageNo: number) =>
  `{range}\nDo the following statements agree with the views of the writer in Reading Passage ${passageNo}?\n\nYES — if the statement agrees with the views of the writer\nNO — if the statement contradicts the views of the writer\nNOT GIVEN — if it is impossible to say what the writer thinks about this`;

export interface BuiltQuestion {
  id: string;
  prompt: string;
  type: "SHORT_ANSWER" | "MULTIPLE_CHOICE";
  kind: QuestionKind;
  options?: string[];
  group?: string;
  figure?: string;
}

export interface BuiltSection {
  title: string;
  passage: string;
  questions: BuiltQuestion[];
  key: Record<string, Answer>;
}

// Question numbers always match the full test (Passage 2 starts where Passage 1
// ended, etc.), so practice tasks and the mock test share numbering and ids.
export function buildSection(p: PassageDef, firstNumber: number): BuiltSection {
  const questions: BuiltQuestion[] = [];
  const key: Record<string, Answer> = {};
  let n = firstNumber;
  for (const g of p.groups) {
    const start = n;
    const end = n + g.questions.length - 1;
    const range = start === end ? `Question ${start}` : `Questions ${start}–${end}`;
    g.questions.forEach((q, i) => {
      const id = `q${n}`;
      const options = q.options ?? g.options;
      questions.push({
        id,
        prompt: q.prompt,
        type: options ? "MULTIPLE_CHOICE" : "SHORT_ANSWER",
        kind: g.kind,
        ...(options ? { options } : {}),
        ...(i === 0 ? { group: g.instruction.replace("{range}", range) } : {}),
        ...(i === 0 && g.figure ? { figure: g.figure } : {}),
      });
      key[id] = q.answer;
      n++;
    });
  }
  return { title: p.title, passage: p.passage, questions, key };
}
