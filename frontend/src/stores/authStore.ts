import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "STUDENT" | "TEACHER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  initializing: boolean;
  setSession: (accessToken: string, user: AuthUser) => void;
  clearSession: () => void;
  setInitializing: (value: boolean) => void;
}

// The access token lives in memory only (never persisted) — the refresh token
// is an httpOnly cookie the browser handles automatically. We DO persist the
// (non-secret) user profile to localStorage so a page reload can show the
// right UI immediately while a fresh access token is silently fetched via
// /auth/refresh in the background (see App.tsx's init effect).
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      initializing: true,
      setSession: (accessToken, user) => set({ accessToken, user }),
      clearSession: () => set({ accessToken: null, user: null }),
      setInitializing: (value) => set({ initializing: value }),
    }),
    {
      name: "ielts-prep-auth-user",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
