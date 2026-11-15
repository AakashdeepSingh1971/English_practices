import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses, createCourse } from "../../api/courses";
import type { Course } from "../../types/domain";

export function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const refresh = () => listCourses().then(setCourses);

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createCourse(title.trim(), description.trim() || undefined);
    setTitle("");
    setDescription("");
    refresh();
  };

  return (
    <div className="page">
      <h1>Your courses</h1>
      <ul className="card-list">
        {courses.map((c) => (
          <li key={c.id}>
            <Link to={`/teacher/courses/${c.id}`}>{c.title}</Link>
            <p className="meta">ID: {c.id} (share with students to enroll)</p>
          </li>
        ))}
      </ul>

      <h2>Create a new course</h2>
      <form onSubmit={handleCreate} className="stacked-form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Create course</button>
      </form>
    </div>
  );
}
