import { apiClient } from "./client";
import type { ViolationTypeValue } from "../types/domain";

export async function logViolation(
  attemptId: string,
  type: ViolationTypeValue
): Promise<{ violationCount: number; shouldAutoSubmit: boolean }> {
  const res = await apiClient.post(`/attempts/${attemptId}/violations`, { type });
  return res.data;
}

export async function forceSubmitAttempt(attemptId: string): Promise<{ submissionId: string }> {
  const res = await apiClient.post(`/attempts/${attemptId}/force-submit`);
  return res.data;
}

export async function getAttemptViolations(attemptId: string) {
  const res = await apiClient.get(`/attempts/${attemptId}/violations`);
  return res.data;
}
