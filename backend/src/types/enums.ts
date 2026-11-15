import { z } from "zod";

export const RoleSchema = z.enum(["STUDENT", "TEACHER_ADMIN"]);
export type Role = z.infer<typeof RoleSchema>;

export const ModuleTypeSchema = z.enum(["LISTENING", "READING", "WRITING", "SPEAKING", "GENERIC"]);
export type ModuleTypeValue = z.infer<typeof ModuleTypeSchema>;

export const TaskTypeSchema = z.enum(["MULTIPLE_CHOICE", "SHORT_ANSWER", "ESSAY", "AUDIO_RESPONSE"]);
export type TaskTypeValue = z.infer<typeof TaskTypeSchema>;

export const SubmissionStatusSchema = z.enum(["IN_PROGRESS", "SUBMITTED", "GRADED"]);
export type SubmissionStatusValue = z.infer<typeof SubmissionStatusSchema>;

export const ViolationTypeSchema = z.enum([
  "TAB_BLUR",
  "FULLSCREEN_EXIT",
  "COPY_PASTE_ATTEMPT",
  "DEVTOOLS_ATTEMPT",
  "CONTEXT_MENU_ATTEMPT",
]);
export type ViolationTypeValue = z.infer<typeof ViolationTypeSchema>;

// Objective module types that get auto-graded via answer key + band conversion.
export const OBJECTIVE_MODULE_TYPES: ModuleTypeValue[] = ["LISTENING", "READING"];
