import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { refreshAccessToken } from "./api/client";
import { logout as apiLogout } from "./api/auth";
import { Login } from "./routes/auth/Login";
import { Register } from "./routes/auth/Register";
import { StudentDashboard } from "./routes/student/Dashboard";
import { StudentCourseView } from "./routes/student/CourseView";
import { StudentResults } from "./routes/student/Results";
import { TaskRunner } from "./components/tasks/TaskRunner";
import { TeacherDashboard } from "./routes/teacher/Dashboard";
import { TeacherCourseEditor } from "./routes/teacher/CourseEditor";
import { TeacherSubmissionsView } from "./routes/teacher/SubmissionsView";
import { Review } from "./routes/results/Review";

function RequireAuth({ role, children }: { role?: "STUDENT" | "TEACHER_ADMIN"; children: React.ReactNode }) {
  const { user, initializing } = useAuthStore();
  if (initializing) return <div className="page">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "TEACHER_ADMIN" ? "/teacher" : "/student"} replace />;
  return <>{children}</>;
}

function TopNav() {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await apiLogout().catch(() => {});
    clearSession();
    navigate("/login");
  };

  return (
    <nav className="top-nav">
      <Link to={user.role === "TEACHER_ADMIN" ? "/teacher" : "/student"} className="brand">
        IELTS Prep Platform
      </Link>
      <span className="meta">
        {user.name} ({user.role === "TEACHER_ADMIN" ? "Teacher" : "Student"})
      </span>
      <button onClick={handleLogout}>Log out</button>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student"
        element={
          <RequireAuth role="STUDENT">
            <StudentDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/student/courses/:courseId"
        element={
          <RequireAuth role="STUDENT">
            <StudentCourseView />
          </RequireAuth>
        }
      />
      <Route
        path="/student/tasks/:taskId/take"
        element={
          <RequireAuth role="STUDENT">
            <TaskRunner />
          </RequireAuth>
        }
      />
      <Route
        path="/student/results"
        element={
          <RequireAuth role="STUDENT">
            <StudentResults />
          </RequireAuth>
        }
      />

      <Route
        path="/teacher"
        element={
          <RequireAuth role="TEACHER_ADMIN">
            <TeacherDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/teacher/courses/:courseId"
        element={
          <RequireAuth role="TEACHER_ADMIN">
            <TeacherCourseEditor />
          </RequireAuth>
        }
      />
      <Route
        path="/teacher/courses/:courseId/submissions"
        element={
          <RequireAuth role="TEACHER_ADMIN">
            <TeacherSubmissionsView />
          </RequireAuth>
        }
      />

      {/* Shared by students (their own attempts) and teachers (attempts in their courses). */}
      <Route
        path="/results/:submissionId"
        element={
          <RequireAuth>
            <Review />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setInitializing = useAuthStore((s) => s.setInitializing);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // Silent session restore on load: the refresh token lives in an httpOnly
    // cookie, so a reload only needs a fresh access token, not a re-login.
    // The user's profile (not the token) survives the reload via localStorage
    // (see authStore's persist config), so we can re-pair it with a new token.
    refreshAccessToken().then((token) => {
      const persistedUser = useAuthStore.getState().user;
      if (token && persistedUser) {
        setSession(token, persistedUser);
      } else {
        clearSession();
      }
      setInitializing(false);
    });
    // Only run once on mount — reading the freshest user via getState() above
    // avoids needing `user` in the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      {user && <TopNav />}
      <AppRoutes />
    </BrowserRouter>
  );
}
