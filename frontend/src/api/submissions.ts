import { apiClient } from "./client";
import type { StartAttemptResponse, Submission, Grade, SubmissionReview } from "../types/domain";

export async function startAttempt(taskId: string): Promise<StartAttemptResponse> {
  const res = await apiClient.post<StartAttemptResponse>(`/tasks/${taskId}/attempts/start`);
  return res.data;
}

export async function autosaveSubmission(submissionId: string, responseJson: Record<string, unknown>) {
  await apiClient.patch(`/submissions/${submissionId}/autosave`, { responseJson });
}

export async function submitSubmission(
  submissionId: string,
  responseJson: Record<string, unknown>
): Promise<{ submission: Submission; grade: Grade | null }> {
  const res = await apiClient.post(`/submissions/${submissionId}/submit`, { responseJson });
  return res.data;
}

export async function getSubmission(submissionId: string): Promise<Submission> {
  const res = await apiClient.get<Submission>(`/submissions/${submissionId}`);
  return res.data;
}

export async function getMyResults(): Promise<Submission[]> {
  const res = await apiClient.get<Submission[]>("/students/me/results");
  return res.data;
}

export async function overrideGrade(
  submissionId: string,
  band: number,
  overrideReason: string,
  criteriaJson?: Record<string, unknown>
) {
  const res = await apiClient.put(`/submissions/${submissionId}/grade`, { band, overrideReason, criteriaJson });
  return res.data;
}

export async function getSubmissionReview(submissionId: string): Promise<SubmissionReview> {
  const res = await apiClient.get<SubmissionReview>(`/submissions/${submissionId}/review`);
  return res.data;
}
