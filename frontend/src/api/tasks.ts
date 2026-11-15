import { apiClient } from "./client";
import type { Task, TaskTypeValue } from "../types/domain";

export async function getTask(taskId: string): Promise<Task> {
  const res = await apiClient.get<Task>(`/tasks/${taskId}`);
  return res.data;
}

export interface CreateTaskInput {
  title: string;
  type: TaskTypeValue;
  order: number;
  timeLimitSec?: number;
  attemptsAllowed?: number;
  lockdownEnabled?: boolean;
  content: Record<string, unknown>;
}

export async function createTask(moduleId: string, input: CreateTaskInput): Promise<Task> {
  const res = await apiClient.post<Task>(`/modules/${moduleId}/tasks`, input);
  return res.data;
}

export async function setAnswerKey(taskId: string, key: Record<string, string | string[]>) {
  const res = await apiClient.put(`/tasks/${taskId}/answer-key`, { key });
  return res.data;
}
