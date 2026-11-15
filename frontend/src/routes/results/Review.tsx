import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSubmissionReview } from "../../api/submissions";
import { describeAnswer } from "../../lib/questions";
import { useAuthStore } from "../../stores/authStore";
import type { ReviewQuestion, SubmissionReview } from "../../types/domain";

export function Review() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const role = useAuthStore((s) => s.user?.role);
  const [review, setReview] = useState<SubmissionReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mistakesOnly, setMistakesOnly] = useState(false);

  useEffect(() => {
    if (!submissionId) return;
    getSubmissionReview(submissionId)
      .then(setReview)
      .catch((err) => setError(err?.response?.data?.error ?? "Could not load this review."));
  }, [submissionId]);

  const isTeacher = role === "TEACHER_ADMIN";
  const home = isTeacher ? "/teacher" : "/student";

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
        <Link to={home}>← Back</Link>
      </div>
    );
  }
  if (!review) return <div className="page">Loading review…</div>;

  const pct = review.total ? Math.round((100 * review.score) / review.total) : 0;
  const minutes = review.submittedAt
    ? Math.max(1, Math.round((new Date(review.submittedAt).getTime() - new Date(review.startedAt).getTime()) / 60000))
    : null;

  return (
    <div className="page page--wide">
      <nav className="crumbs">
        {isTeacher ? (
          <Link to={`/teacher/courses/${review.courseId}/submissions`}>← Submissions</Link>
        ) : (
          <>
            <Link to="/student/results">← All results</Link>
            <Link to={`/student/courses/${review.courseId}`}>Course</Link>
          </>
        )}
      </nav>

      <h1>{review.taskTitle}</h1>
      <p className="meta">
        {review.moduleTitle}
        {isTeacher ? ` · ${review.studentName}` : ""}
        {review.submittedAt ? ` · submitted ${new Date(review.submittedAt).toLocaleString()}` : ""}
        {minutes ? ` · took ${minutes} min` : ""}
      </p>

      <div className="score-cards">
        <div className="score-card">
          <span className="score-card__label">Score</span>
          <span className="score-card__value">
            {review.score}/{review.total}
          </span>
          <span className="meta">{pct}%</span>
        </div>
        <div className="score-card">
          <span className="score-card__label">Band</span>
          <span className="score-card__value">{review.band !== null ? review.band.toFixed(1) : "—"}</span>
          <span className="meta">{review.total !== 40 && review.band !== null ? "scaled to 40 questions" : ""}</span>
        </div>
        <div className="score-card score-card--wide">
          <span className="score-card__label">By question type</span>
          <table className="kind-table">
            <tbody>
              {[...review.byKind]
                .sort((a, b) => a.correct / a.total - b.correct / b.total)
                .map((k) => (
                  <tr key={k.kind}>
                    <td>{k.kind}</td>
                    <td className="kind-table__bar">
                      <span style={{ width: `${(100 * k.correct) / k.total}%` }} />
                    </td>
                    <td className="kind-table__num">
                      {k.correct}/{k.total}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="review-actions">
        <label className="checkbox-label">
          <input type="checkbox" checked={mistakesOnly} onChange={(e) => setMistakesOnly(e.target.checked)} />
          Show only mistakes ({review.total - review.score})
        </label>
        {!isTeacher && <Link to={`/student/tasks/${review.taskId}/take`}>Retake this task →</Link>}
      </div>

      {review.sections.map((section) => {
        const shown = section.questions.filter((q) => !mistakesOnly || !q.correct);
        if (shown.length === 0) return null;
        return (
          <section key={section.title} className="review-section">
            {section.title && <h2>{section.title}</h2>}
            {section.passage && (
              <details className="review-passage">
                <summary>Show passage</summary>
                <div className="passage-text">{section.passage}</div>
              </details>
            )}
            <ul className="review-list">
              {shown.map((q) => (
                <ReviewItem key={q.id} q={q} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ReviewItem({ q }: { q: ReviewQuestion }) {
  const correctList = q.correctAnswer === null ? [] : [q.correctAnswer].flat();
  const blank = !q.given?.trim();
  return (
    <li className={q.correct ? "review-item review-item--ok" : "review-item review-item--bad"}>
      <div className="review-item__head">
        <span className="review-item__mark" aria-label={q.correct ? "correct" : "incorrect"}>
          {q.correct ? "✓" : "✗"}
        </span>
        <strong>Q{q.number}</strong>
        <span className="tag">{q.kind}</span>
      </div>
      {q.group && <div className="question-group">{q.group}{q.figure && <pre>{q.figure}</pre>}</div>}
      <p>{q.prompt}</p>
      <div className="review-item__answers">
        <div>
          <span className="meta">Your answer: </span>
          {blank ? <em className="meta">(blank)</em> : describeAnswer(q.given!, q.options)}
        </div>
        {!q.correct && correctList.length > 0 && (
          <div>
            <span className="meta">Correct answer: </span>
            <strong>{describeAnswer(correctList[0], q.options)}</strong>
            {correctList.length > 1 && (
              <span className="meta"> (also accepted: {correctList.slice(1).join(", ")})</span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
