import { apiClient } from "./client";
import type { Course, CourseModule } from "../types/domain";

export async function listCourses(): Promise<Course[]> {
  const res = await apiClient.get<Course[]>("/courses");
  return res.data;
}

export async function getCourse(courseId: string): Promise<Course> {
  const res = await apiClient.get<Course>(`/courses/${courseId}`);
  return res.data;
}

export async function createCourse(title: string, description?: string): Promise<Course> {
  const res = await apiClient.post<Course>("/courses", { title, description });
  return res.data;
}

export async function enrollInCourse(courseId: string): Promise<void> {
  await apiClient.post(`/courses/${courseId}/enroll`);
}

export async function getRoster(courseId: string) {
  const res = await apiClient.get(`/courses/${courseId}/roster`);
  return res.data;
}

export async function getCourseSubmissions(courseId: string) {
  const res = await apiClient.get(`/courses/${courseId}/submissions`);
  return res.data;
}

export async function createModule(
  courseId: string,
  title: string,
  type: CourseModule["type"],
  order: number
): Promise<CourseModule> {
  const res = await apiClient.post<CourseModule>(`/courses/${courseId}/modules`, { title, type, order });
  return res.data;
}
