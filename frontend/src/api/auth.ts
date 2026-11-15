import { apiClient } from "./client";
import type { AuthUser, Role } from "../stores/authStore";

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
}

export async function register(
  email: string,
  password: string,
  name: string,
  role: Role
): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/register", { email, password, name, role });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
