export type ModuleTypeValue = "LISTENING" | "READING" | "WRITING" | "SPEAKING" | "GENERIC";
export type TaskTypeValue = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "ESSAY" | "AUDIO_RESPONSE";
export type SubmissionStatusValue = "IN_PROGRESS" | "SUBMITTED" | "GRADED";
export type ViolationTypeValue =
  | "TAB_BLUR"
  | "FULLSCREEN_EXIT"
  | "COPY_PASTE_ATTEMPT"
  | "DEVTOOLS_ATTEMPT"
  | "CONTEXT_MENU_ATTEMPT";

export interface TaskQuestion {
  id: string;
  prompt: string;
  type: "SHORT_ANSWER" | "MULTIPLE_CHOICE";
  options?: string[];
  // Question type label for reading practice (e.g. "Matching headings").
  kind?: string;
  // Optional IELTS-style group header ("Questions 1–5 ... Write TRUE, FALSE or NOT GIVEN"),
  // shown above the first question of a group.
  group?: string;
  // Optional monospace text figure (e.g. a labelled diagram) shown with the group header.
  figure?: string;
}

// A passage with its own questions — lets one task hold a full multi-passage test.
export interface TaskSection {
  title: string;
  passage: string;
  questions: TaskQuestion[];
}

export interface TaskContent {
  instructions: string;
  passage?: string;
  audioUrl?: string | null;
  questions: TaskQuestion[];
  sections?: TaskSection[];
  // What each section is called in the UI: "Passage" (Academic) or "Section" (General Training).
  sectionLabel?: string;
}

export interface Task {
  id: string;
  moduleId: string;
  title: string;
  type: TaskTypeValue;
  order: number;
  timeLimitSec: number | null;
  attemptsAllowed: number;
  lockdownEnabled: boolean;
  passCriteria: Record<string, unknown> | null;
  content: TaskContent;
  module?: { id: string; courseId: string; title: string };
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  type: ModuleTypeValue;
  order: number;
  tasks: Task[];
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  modules?: CourseModule[];
}

export interface Grade {
  id: string;
  submissionId: string;
  band: number;
  criteriaJson: Record<string, unknown> | null;
  aiRawResponse: string | null;
  gradedBy: string;
  overriddenByUserId: string | null;
  overrideReason: string | null;
  gradedAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string;
  status: SubmissionStatusValue;
  responseJson: Record<string, unknown> | string;
  rawScore: number | null;
  startedAt: string;
  submittedAt: string | null;
  task?: Task & { module?: CourseModule };
  grade?: Grade | null;
}

export interface StartAttemptResponse {
  submissionId: string;
  attemptId: string | null;
  startedAt: string;
  timeLimitSec: number | null;
  remainingSec: number | null;
  lockdownEnabled: boolean;
  resumed: boolean;
  answers: Record<string, string>;
}

export interface ReviewQuestion extends TaskQuestion {
  kind: string;
  number: number;
  given: string | null;
  correctAnswer: string | string[] | null;
  correct: boolean;
}

export interface SubmissionReview {
  submissionId: string;
  taskId: string;
  taskTitle: string;
  courseId: string;
  moduleTitle: string;
  studentName: string;
  submittedAt: string | null;
  startedAt: string;
  score: number;
  total: number;
  band: number | null;
  byKind: Array<{ kind: string; correct: number; total: number }>;
  sections: Array<{ title: string; passage: string; questions: ReviewQuestion[] }>;
}
