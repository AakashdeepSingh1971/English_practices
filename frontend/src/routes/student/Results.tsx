import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyResults } from "../../api/submissions";
import type { Submission } from "../../types/domain";

export function StudentResults() {
  const [results, setResults] = useState<Submission[] | null>(null);

  useEffect(() => {
    getMyResults().then(setResults);
  }, []);

  return (
    <div className="page">
      <Link to="/student" className="back-link">
        ← Back to my courses
      </Link>
      <h1>Your results</h1>
      {results === null && <p>Loading…</p>}
      {results && results.length > 0 && (
        <div className="table-scroll">
          <table className="results-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Module</th>
                <th>Score</th>
                <th>Band</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.task?.title}</td>
                  <td>{r.task?.module?.title}</td>
                  <td>{r.rawScore ?? "—"}</td>
                  <td>{r.grade ? r.grade.band.toFixed(1) : "—"}</td>
                  <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "In progress"}</td>
                  <td>
                    {r.status === "IN_PROGRESS" ? (
                      <Link to={`/student/tasks/${r.taskId}/take`}>Resume</Link>
                    ) : (
                      <Link to={`/results/${r.id}`}>Review answers</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {results && results.length === 0 && <p>No submissions yet.</p>}
    </div>
  );
}
