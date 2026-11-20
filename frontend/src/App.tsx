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
import { InstallAppButton } from "./components/pwa/InstallAppButton";

function RequireAuth({ role, children }: { role?: "STUDENT" | "TEACHER_ADMIN"; children: React.ReactNode }) {
  const { user, initializing } = useAuthStore();
  if (initializing) return <div className="page">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "TEACHER_ADMIN" ? "/teacher" : "/student"} replace />;
  return <>{children}</>;
}

const homeFor = (role: "STUDENT" | "TEACHER_ADMIN") => (role === "TEACHER_ADMIN" ? "/teacher" : "/student");

// The installed app opens at "/": go straight to the dashboard when the session
// was restored, otherwise to the login page.
function Home() {
  const { user, initializing } = useAuthStore();
  if (initializing) return <div className="page">Loading…</div>;
  return <Navigate to={user ? homeFor(user.role) : "/login"} replace />;
}

// Login and sign-up pages send an already signed-in user to their dashboard.
function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuthStore();
  if (initializing) return <div className="page">Loading…</div>;
  if (user) return <Navigate to={homeFor(user.role)} replace />;
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
      <InstallAppButton />
      <button onClick={handleLogout}>Log out</button>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <Register />
          </GuestOnly>
        }
      />

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

      <Route path="*" element={<Navigate to="/" replace />} />
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
    // cookie, and the server returns both a fresh access token and the profile.
    // So a reload, a new tab or the installed app (which shares the browser's
    // cookies on Android and desktop) continues the session without a re-login.
    // The persisted profile only lets the right UI show while this runs.
    refreshAccessToken().then((session) => {
      if (session) setSession(session.accessToken, session.user);
      else clearSession();
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
