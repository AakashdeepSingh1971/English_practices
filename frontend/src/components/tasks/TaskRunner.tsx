import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTask } from "../../api/tasks";
import { startAttempt, autosaveSubmission, submitSubmission } from "../../api/submissions";
import { forceSubmitAttempt } from "../../api/attempts";
import { saveDraftAnswers, loadDraftAnswers, clearDraftAnswers } from "../../lib/idbCache";
import { optionValue, questionNumber } from "../../lib/questions";
import { useLockdown } from "../lockdown/useLockdown";
import { LockdownOverlay } from "../lockdown/LockdownOverlay";
import { useTestSessionStore } from "../../stores/testSessionStore";
import type { Task, TaskQuestion, TaskSection } from "../../types/domain";

const AUTOSAVE_DEBOUNCE_MS = 1000;

// Every task is rendered as one or more sections. Older single-passage tasks
// (content.passage + content.questions) become a single section.
function sectionsOf(task: Task): TaskSection[] {
  return (
    task.content.sections ?? [
      { title: "", passage: task.content.passage ?? "", questions: task.content.questions },
    ]
  );
}

export function TaskRunner() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const answersRef = useRef(answers);
  const submissionIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const resetSession = useTestSessionStore((s) => s.reset);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!taskId) return;
    resetSession();
    getTask(taskId)
      .then(setTask)
      .catch(() => setError("Could not load this task. You may not be enrolled in its course."));
  }, [taskId, resetSession]);

  const doSubmit = async () => {
    const id = submissionIdRef.current;
    if (!id || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      // Save locally first so nothing is lost if the network call fails.
      await saveDraftAnswers(id, answersRef.current).catch(() => {});
      await submitSubmission(id, { answers: answersRef.current });
      await clearDraftAnswers(id).catch(() => {});
      navigate(`/results/${id}`, { replace: true });
    } catch {
      setError("Failed to submit. Your answers are saved — refresh the page and try again.");
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    if (attemptId) forceSubmitAttempt(attemptId).catch(() => {});
    doSubmit();
  };

  const { requestFullscreen } = useLockdown({
    enabled: started && Boolean(task?.lockdownEnabled),
    attemptId,
    onAutoSubmit: handleAutoSubmit,
  });

  const handleStart = async () => {
    if (!taskId) return;
    try {
      const res = await startAttempt(taskId);
      setSubmissionId(res.submissionId);
      submissionIdRef.current = res.submissionId;
      setAttemptId(res.attemptId);
      setResumed(res.resumed);
      setRemainingSec(res.remainingSec ?? res.timeLimitSec);

      // Local draft is at most a few seconds newer than the server copy.
      const draft = (await loadDraftAnswers(res.submissionId).catch(() => undefined)) as
        | Record<string, string>
        | undefined;
      setAnswers({ ...res.answers, ...(draft ?? {}) });

      if (res.lockdownEnabled) requestFullscreen();
      setStarted(true);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.submissionId) {
        // Time ran out on an earlier attempt and the server submitted it.
        navigate(`/results/${data.submissionId}`, { replace: true });
        return;
      }
      setError(data?.error ?? "Could not start this task.");
    }
  };

  // Countdown timer.
  useEffect(() => {
    if (!started || remainingSec === null) return;
    if (remainingSec <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setTimeout(() => setRemainingSec((s) => (s !== null ? s - 1 : s)), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, remainingSec]);

  // Autosave on every change: IndexedDB immediately (survives a refresh), the
  // backend shortly after (durable; lets the attempt be resumed later or on
  // another device).
  useEffect(() => {
    if (!started || !submissionId) return;
    saveDraftAnswers(submissionId, answers).catch(() => {});
    const timer = setTimeout(() => {
      autosaveSubmission(submissionId, { answers }).catch(() => {});
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [answers, started, submissionId]);

  // Leaving the page (e.g. "Back to course") flushes the latest answers to the
  // server so the debounce above can't drop the last few seconds of work.
  useEffect(
    () => () => {
      const id = submissionIdRef.current;
      if (id && !submittingRef.current) autosaveSubmission(id, { answers: answersRef.current }).catch(() => {});
    },
    []
  );

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
        <Link to="/student">← Back to my courses</Link>
      </div>
    );
  }
  if (!task) return <div className="page">Loading task…</div>;

  const sections = sectionsOf(task);
  const allQuestions = sections.flatMap((s) => s.questions);
  const unanswered = allQuestions.filter((q) => !answers[q.id]?.trim()).length;
  const backTo = task.module ? `/student/courses/${task.module.courseId}` : "/student";

  if (!started) {
    return (
      <div className="page">
        <Link to={backTo} className="back-link">
          ← Back to course
        </Link>
        <h1>{task.title}</h1>
        <p style={{ whiteSpace: "pre-wrap" }}>{task.content.instructions}</p>
        <p className="meta">
          {allQuestions.length} questions
          {task.timeLimitSec ? ` · ${Math.round(task.timeLimitSec / 60)} minutes` : ""}
          {sections.length > 1 ? ` · ${sections.length} ${(task.content.sectionLabel ?? "Passage").toLowerCase()}s` : ""}
        </p>
        {task.lockdownEnabled && (
          <p className="warning">
            This is a monitored test environment: fullscreen will be enforced, and switching tabs, exiting
            fullscreen, copy/paste, or devtools shortcuts will be logged as violations. Two violations will
            auto-submit your test. This is a best-effort deterrent, not a guarantee against all cheating.
          </p>
        )}
        <p className="hint">
          If you leave mid-test, your answers are kept and you can resume. The timer keeps running.
        </p>
        <button onClick={handleStart}>Start / Resume Test</button>
      </div>
    );
  }

  const jumpTo = (sectionIndex: number, questionId: string) => {
    setActiveSection(sectionIndex);
    requestAnimationFrame(() =>
      document.getElementById(`question-${questionId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    );
  };

  const handleSubmitClick = () => {
    if (unanswered > 0 && !confirmingSubmit) {
      // Inline confirmation rather than window.confirm(), which steals focus
      // and would be logged as a violation in monitored tests.
      setConfirmingSubmit(true);
      return;
    }
    doSubmit();
  };

  const section = sections[activeSection] ?? sections[0];
  const firstIndex = sections.slice(0, activeSection).reduce((n, s) => n + s.questions.length, 0);

  const questionList = (questions: TaskQuestion[], offset: number) => (
    <ol className="questions" start={questions[0] ? questionNumber(questions[0], offset + 1) : 1}>
      {questions.map((q) => (
        <li key={q.id} id={`question-${q.id}`}>
          {(q.group || q.figure) && (
            <div className="question-group">
              {q.group}
              {q.figure && <pre>{q.figure}</pre>}
            </div>
          )}
          <p>{q.prompt}</p>
          {q.type === "MULTIPLE_CHOICE" && q.options ? (
            <div className="options">
              {q.options.map((opt) => {
                const value = optionValue(opt);
                return (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={q.id}
                      value={value}
                      checked={answers[q.id] === value}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: value }))}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
            />
          )}
        </li>
      ))}
    </ol>
  );

  return (
    <div className="test-shell">
      <LockdownOverlay />
      <header className="test-bar">
        <strong className="test-bar__title">{task.title}</strong>
        {sections.length > 1 && (
          <nav className="tabs" aria-label={`${task.content.sectionLabel ?? "Passage"}s`}>
            {sections.map((s, i) => (
              <button
                key={s.title + i}
                className={i === activeSection ? "tab tab--active" : "tab"}
                onClick={() => setActiveSection(i)}
              >
                {task.content.sectionLabel ?? "Passage"} {i + 1}
              </button>
            ))}
          </nav>
        )}
        {remainingSec !== null && (
          <div className={remainingSec < 300 ? "timer timer--low" : "timer"}>{formatTime(remainingSec)}</div>
        )}
        <button onClick={handleSubmitClick} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </header>

      {resumed && <p className="resume-note">Resumed your in-progress attempt — your saved answers are restored.</p>}
      {confirmingSubmit && !submitting && (
        <div className="confirm-bar" role="alert">
          You have {unanswered} unanswered question{unanswered === 1 ? "" : "s"}. Submit anyway?
          <button onClick={doSubmit}>Submit now</button>
          <button className="secondary" onClick={() => setConfirmingSubmit(false)}>
            Keep working
          </button>
        </div>
      )}

      {task.content.audioUrl && <audio controls src={task.content.audioUrl} className="test-audio" />}

      {section.passage ? (
        <div className="split">
          <article className="split__passage">
            {section.title && <h2>{section.title}</h2>}
            <div className="passage-text">{section.passage}</div>
          </article>
          <div className="split__questions">{questionList(section.questions, firstIndex)}</div>
        </div>
      ) : (
        <div className="single">{questionList(section.questions, firstIndex)}</div>
      )}

      <footer className="navigator" aria-label="Question navigator">
        {sections.map((s, si) =>
          s.questions.map((q, qi) => {
            const n = questionNumber(q, sections.slice(0, si).reduce((t, x) => t + x.questions.length, 0) + qi + 1);
            const answered = Boolean(answers[q.id]?.trim());
            return (
              <button
                key={q.id}
                className={`nav-q${answered ? " nav-q--done" : ""}${si === activeSection ? " nav-q--here" : ""}`}
                onClick={() => jumpTo(si, q.id)}
                title={answered ? `Question ${n} answered` : `Question ${n} not answered`}
              >
                {n}
              </button>
            );
          })
        )}
        <span className="navigator__count">
          {allQuestions.length - unanswered}/{allQuestions.length} answered
        </span>
      </footer>
    </div>
  );
}

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
