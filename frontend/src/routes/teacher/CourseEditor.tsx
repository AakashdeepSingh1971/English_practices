import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse, createModule } from "../../api/courses";
import { createTask, setAnswerKey } from "../../api/tasks";
import type { Course, ModuleTypeValue, TaskTypeValue, Task } from "../../types/domain";

const MODULE_TYPES: ModuleTypeValue[] = ["LISTENING", "READING", "WRITING", "SPEAKING", "GENERIC"];
const TASK_TYPES: TaskTypeValue[] = ["SHORT_ANSWER", "MULTIPLE_CHOICE", "ESSAY", "AUDIO_RESPONSE"];

const SAMPLE_CONTENT = JSON.stringify(
  {
    instructions: "Answer the questions below.",
    questions: [{ id: "q1", prompt: "Example question?", type: "SHORT_ANSWER" }],
  },
  null,
  2
);
const SAMPLE_KEY = JSON.stringify({ q1: "example answer" }, null, 2);

export function TeacherCourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    if (courseId) getCourse(courseId).then(setCourse).catch(() => setError("Could not load this course."));
  };

  useEffect(refresh, [courseId]);

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!course) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h1>{course.title}</h1>
      <p className="meta">Course ID (share with students): {course.id}</p>
      <p>
        <Link to={`/teacher/courses/${course.id}/submissions`}>View submissions &amp; roster</Link>
      </p>

      {course.modules?.map((module) => (
        <ModuleEditor key={module.id} moduleId={module.id} title={module.title} type={module.type} tasks={module.tasks} onChange={refresh} />
      ))}

      <AddModuleForm courseId={course.id} nextOrder={(course.modules?.length ?? 0) + 1} onAdded={refresh} />
    </div>
  );
}

function ModuleEditor({
  moduleId,
  title,
  type,
  tasks,
  onChange,
}: {
  moduleId: string;
  title: string;
  type: ModuleTypeValue;
  tasks: Task[];
  onChange: () => void;
}) {
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <section>
      <h2>
        {title} <span className="meta">({type})</span>
      </h2>
      <ul className="card-list">
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} <span className="meta">· {task.type} · ID: {task.id}</span>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p className="note">No tasks yet.</p>}
      <button onClick={() => setShowAddTask((v) => !v)}>{showAddTask ? "Cancel" : "Add task"}</button>
      {showAddTask && (
        <AddTaskForm
          moduleId={moduleId}
          nextOrder={tasks.length + 1}
          onAdded={() => {
            setShowAddTask(false);
            onChange();
          }}
        />
      )}
    </section>
  );
}

function AddModuleForm({ courseId, nextOrder, onAdded }: { courseId: string; nextOrder: number; onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ModuleTypeValue>("GENERIC");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createModule(courseId, title.trim(), type, nextOrder);
    setTitle("");
    onAdded();
  };

  return (
    <form onSubmit={submit} className="stacked-form">
      <h3>Add module</h3>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value as ModuleTypeValue)}>
          {MODULE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Add module</button>
    </form>
  );
}

function AddTaskForm({ moduleId, nextOrder, onAdded }: { moduleId: string; nextOrder: number; onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskTypeValue>("SHORT_ANSWER");
  const [timeLimitMin, setTimeLimitMin] = useState<number | "">("");
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [lockdownEnabled, setLockdownEnabled] = useState(true);
  const [contentText, setContentText] = useState(SAMPLE_CONTENT);
  const [keyText, setKeyText] = useState(SAMPLE_KEY);
  const [formError, setFormError] = useState<string | null>(null);

  const isObjective = type === "SHORT_ANSWER" || type === "MULTIPLE_CHOICE";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    let content: Record<string, unknown>;
    try {
      content = JSON.parse(contentText);
    } catch {
      setFormError("Content JSON is invalid.");
      return;
    }
    try {
      const task = await createTask(moduleId, {
        title,
        type,
        order: nextOrder,
        timeLimitSec: timeLimitMin ? Number(timeLimitMin) * 60 : undefined,
        attemptsAllowed,
        lockdownEnabled,
        content,
      });
      if (isObjective) {
        const key = JSON.parse(keyText);
        await setAnswerKey(task.id, key);
      }
      onAdded();
    } catch {
      setFormError("Could not save this task — check the JSON fields.");
    }
  };

  return (
    <form onSubmit={submit} className="stacked-form task-form">
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value as TaskTypeValue)}>
          {TASK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        Time limit (minutes, blank = untimed)
        <input
          type="number"
          value={timeLimitMin}
          onChange={(e) => setTimeLimitMin(e.target.value ? Number(e.target.value) : "")}
        />
      </label>
      <label>
        Attempts allowed
        <input type="number" min={1} value={attemptsAllowed} onChange={(e) => setAttemptsAllowed(Number(e.target.value))} />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" checked={lockdownEnabled} onChange={(e) => setLockdownEnabled(e.target.checked)} />
        Monitored test environment (lockdown)
      </label>
      <label>
        Content JSON ({"{"}instructions, passage?, audioUrl?, questions: [...]{"}"})
        <textarea rows={8} value={contentText} onChange={(e) => setContentText(e.target.value)} />
      </label>
      {isObjective && (
        <label>
          Answer key JSON (questionId → correct answer or array of accepted answers)
          <textarea rows={4} value={keyText} onChange={(e) => setKeyText(e.target.value)} />
        </label>
      )}
      {formError && <p className="error">{formError}</p>}
      <button type="submit">Save task</button>
    </form>
  );
}
