import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseSubmissions, getRoster } from "../../api/courses";
import { overrideGrade } from "../../api/submissions";

interface SubmissionRow {
  id: string;
  status: string;
  rawScore: number | null;
  startedAt: string;
  submittedAt: string | null;
  task: { title: string; module: { title: string } };
  user: { id: string; name: string; email: string };
  grade: { band: number; overriddenByUserId: string | null } | null;
  attempt: { autoSubmitted: boolean; violations: { type: string }[] } | null;
}

export function TeacherSubmissionsView() {
  const { courseId } = useParams<{ courseId: string }>();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [roster, setRoster] = useState<{ id: string; name: string; email: string }[]>([]);

  const refresh = () => {
    if (!courseId) return;
    getCourseSubmissions(courseId).then(setSubmissions);
    getRoster(courseId).then(setRoster);
  };

  useEffect(refresh, [courseId]);

  const handleOverride = async (submissionId: string) => {
    const bandStr = window.prompt("Band score (0-9):");
    if (bandStr === null) return;
    const band = Number(bandStr);
    if (Number.isNaN(band)) return;
    const reason = window.prompt("Reason for this grade/override:") ?? "Manual grade";
    await overrideGrade(submissionId, band, reason);
    refresh();
  };

  return (
    <div className="page">
      <Link to={`/teacher/courses/${courseId}`} className="back-link">
        ← Back to course
      </Link>
      <h1>Submissions</h1>

      <h2>Roster ({roster.length})</h2>
      <ul className="card-list">
        {roster.map((s) => (
          <li key={s.id}>
            {s.name} ({s.email})
          </li>
        ))}
      </ul>

      <h2>Submissions</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Module</th>
            <th>Task</th>
            <th>Status</th>
            <th>Band</th>
            <th>Violations</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.user.name}</td>
              <td>{s.task.module.title}</td>
              <td>{s.task.title}</td>
              <td>
                {s.status}
                {s.attempt?.autoSubmitted && <span className="meta"> (auto-submitted)</span>}
              </td>
              <td>
                {s.grade ? s.grade.band.toFixed(1) : "—"}
                {s.grade?.overriddenByUserId && <span className="meta"> (overridden)</span>}
              </td>
              <td>{s.attempt ? s.attempt.violations.length : 0}</td>
              <td className="row-actions">
                {s.status !== "IN_PROGRESS" && <Link to={`/results/${s.id}`}>Review</Link>}
                <button onClick={() => handleOverride(s.id)}>Set / override grade</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {submissions.length === 0 && <p>No submissions yet.</p>}
    </div>
  );
}
