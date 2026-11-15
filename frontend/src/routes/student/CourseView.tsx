import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse } from "../../api/courses";
import { getMyResults } from "../../api/submissions";
import type { Course, Submission } from "../../types/domain";

interface TaskProgress {
  attempts: number;
  inProgress: boolean;
  bestBand: number | null;
  last: Submission | null;
}

function progressByTask(results: Submission[]): Map<string, TaskProgress> {
  const map = new Map<string, TaskProgress>();
  // Results arrive newest first, so the first finished one seen is the latest.
  for (const r of results) {
    const p = map.get(r.taskId) ?? { attempts: 0, inProgress: false, bestBand: null, last: null };
    p.attempts++;
    if (r.status === "IN_PROGRESS") p.inProgress = true;
    else if (!p.last) p.last = r;
    if (r.grade && (p.bestBand === null || r.grade.band > p.bestBand)) p.bestBand = r.grade.band;
    map.set(r.taskId, p);
  }
  return map;
}

export function StudentCourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Map<string, TaskProgress>>(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    getCourse(courseId)
      .then(setCourse)
      .catch(() => setError("Could not load this course."));
    getMyResults()
      .then((r) => setProgress(progressByTask(r)))
      .catch(() => {});
  }, [courseId]);

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!course) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/student">← My courses</Link>
        <Link to="/student/results">My results</Link>
      </nav>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      {course.modules?.map((module) => {
        const done = module.tasks.filter((t) => progress.get(t.id)?.last).length;
        return (
          <section key={module.id}>
            <h2>
              {module.title}
              {module.tasks.length > 0 && (
                <span className="meta">
                  {" "}
                  · {done}/{module.tasks.length} done
                </span>
              )}
            </h2>
            {module.tasks.length === 0 && <p className="note">No tasks yet in this module.</p>}
            <ul className="card-list">
              {module.tasks.map((task) => {
                const p = progress.get(task.id);
                return (
                  <li key={task.id} className="task-card">
                    <div>
                      <Link to={`/student/tasks/${task.id}/take`}>{task.title}</Link>
                      {task.timeLimitSec && <span className="meta"> · {Math.round(task.timeLimitSec / 60)} min</span>}
                      {task.lockdownEnabled && <span className="meta"> · monitored</span>}
                    </div>
                    <div className="task-card__status">
                      {!p && <span className="status status--new">Not started</span>}
                      {p?.inProgress && (
                        <Link to={`/student/tasks/${task.id}/take`} className="status status--progress">
                          In progress — resume
                        </Link>
                      )}
                      {p?.last && (
                        <>
                          <span className="status status--done">
                            {p.attempts} attempt{p.attempts === 1 ? "" : "s"}
                            {p.bestBand !== null ? ` · best band ${p.bestBand.toFixed(1)}` : ""}
                          </span>
                          <Link to={`/results/${p.last.id}`}>Review last</Link>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
