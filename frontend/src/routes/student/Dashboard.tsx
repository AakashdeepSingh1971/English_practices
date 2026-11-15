import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses, enrollInCourse } from "../../api/courses";
import type { Course } from "../../types/domain";

export function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollId, setEnrollId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const refresh = () => listCourses().then(setCourses);

  useEffect(() => {
    refresh();
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await enrollInCourse(enrollId.trim());
      setEnrollId("");
      setMessage("Enrolled!");
      refresh();
    } catch {
      setMessage("Could not enroll — check the course ID.");
    }
  };

  return (
    <div className="page">
      <h1>Your courses</h1>
      <ul className="card-list">
        {courses.map((c) => (
          <li key={c.id}>
            <Link to={`/student/courses/${c.id}`}>{c.title}</Link>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
      {courses.length === 0 && <p>You're not enrolled in any course yet.</p>}

      <form onSubmit={handleEnroll} className="inline-form">
        <input
          placeholder="Course ID (ask your teacher)"
          value={enrollId}
          onChange={(e) => setEnrollId(e.target.value)}
        />
        <button type="submit">Enroll</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        <Link to="/student/results">View my results</Link>
      </p>
    </div>
  );
}
