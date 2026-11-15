import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../src/app";
import { prisma } from "../src/prisma";
import { buildSection } from "../prisma/reading/types";
import { READING_TESTS } from "../prisma/reading/tests";

const api = request(app);
const PASSWORD = "password123";

async function makeUser(email: string, role: "STUDENT" | "TEACHER_ADMIN") {
  const user = await prisma.user.create({
    data: { email, name: email.split("@")[0], role, passwordHash: await bcrypt.hash(PASSWORD, 4) },
  });
  const res = await api.post("/api/auth/login").send({ email, password: PASSWORD });
  expect(res.status).toBe(200);
  return { user, auth: { Authorization: `Bearer ${res.body.accessToken}` } };
}

let teacher: Awaited<ReturnType<typeof makeUser>>;
let otherTeacher: Awaited<ReturnType<typeof makeUser>>;
let student: Awaited<ReturnType<typeof makeUser>>;
let otherStudent: Awaited<ReturnType<typeof makeUser>>;
let outsider: Awaited<ReturnType<typeof makeUser>>;
let passageTaskId: string;
let mockTaskId: string;
let key: Record<string, string | string[]>;

beforeAll(async () => {
  teacher = await makeUser("teacher@test.local", "TEACHER_ADMIN");
  otherTeacher = await makeUser("teacher2@test.local", "TEACHER_ADMIN");
  student = await makeUser("student@test.local", "STUDENT");
  otherStudent = await makeUser("student2@test.local", "STUDENT");
  outsider = await makeUser("outsider@test.local", "STUDENT");

  const course = await prisma.course.create({ data: { title: "Test course", createdById: teacher.user.id } });
  for (const s of [student, otherStudent]) {
    await prisma.enrollment.create({ data: { userId: s.user.id, courseId: course.id } });
  }
  const module = await prisma.module.create({
    data: { courseId: course.id, title: "Reading", type: "READING", order: 1 },
  });

  // Passage 2 of Test 1 (questions 14–26) as a practice task, plus the full test as a monitored mock.
  const test = READING_TESTS[0];
  let next = 1;
  const sections = test.passages.map((p) => {
    const s = buildSection(p, next);
    next += s.questions.length;
    return s;
  });
  const strip = (s: (typeof sections)[number]) => ({ title: s.title, passage: s.passage, questions: s.questions });

  const passage = await prisma.task.create({
    data: {
      moduleId: module.id, title: "Passage 2", type: "MULTIPLE_CHOICE", order: 1,
      timeLimitSec: 1200, attemptsAllowed: 2, lockdownEnabled: false,
      contentJson: JSON.stringify({ instructions: "x", questions: [], sections: [strip(sections[1])] }),
    },
  });
  await prisma.answerKey.create({ data: { taskId: passage.id, keyJson: JSON.stringify(sections[1].key) } });
  passageTaskId = passage.id;
  key = sections[1].key;

  const mock = await prisma.task.create({
    data: {
      moduleId: module.id, title: "Mock", type: "MULTIPLE_CHOICE", order: 2,
      timeLimitSec: 3600, attemptsAllowed: 5, lockdownEnabled: true,
      contentJson: JSON.stringify({ instructions: "x", questions: [], sections: sections.map(strip) }),
    },
  });
  await prisma.answerKey.create({
    data: { taskId: mock.id, keyJson: JSON.stringify(Object.assign({}, ...sections.map((s) => s.key))) },
  });
  mockTaskId = mock.id;
});

// Each test starts with no attempts on record.
beforeEach(async () => {
  await prisma.violation.deleteMany();
  await prisma.testAttempt.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.submission.deleteMany();
});

const start = (who: typeof student, taskId = passageTaskId) =>
  api.post(`/api/tasks/${taskId}/attempts/start`).set(who.auth);
const submit = (who: typeof student, id: string, answers: Record<string, string>) =>
  api.post(`/api/submissions/${id}/submit`).set(who.auth).send({ responseJson: { answers } });

describe("auth", () => {
  it("rejects requests without a token", async () => {
    expect((await api.get("/api/students/me/results")).status).toBe(401);
  });
  it("public sign-up always creates a student, even if a teacher role is requested", async () => {
    const res = await api
      .post("/api/auth/register")
      .send({ email: "sneaky@test.local", password: PASSWORD, name: "Sneaky", role: "TEACHER_ADMIN" });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("STUDENT");
    expect((await prisma.user.findUnique({ where: { email: "sneaky@test.local" } }))!.role).toBe("STUDENT");
  });
  it("answers unknown API routes with JSON 404", async () => {
    const res = await api.get("/api/nope").set(student.auth);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
  it("rejects a wrong password", async () => {
    const res = await api.post("/api/auth/login").send({ email: "student@test.local", password: "nope" });
    expect(res.status).toBe(401);
  });
});

describe("task content", () => {
  it("never sends the answer key to students", async () => {
    const res = await api.get(`/api/tasks/${passageTaskId}`).set(student.auth);
    expect(res.status).toBe(200);
    expect(res.body.answerKey).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain("keyJson");
    expect(res.body.content.sections[0].questions).toHaveLength(13);
    expect(res.body.module.courseId).toBeDefined();
  });
  it("is forbidden to students who are not enrolled", async () => {
    expect((await api.get(`/api/tasks/${passageTaskId}`).set(outsider.auth)).status).toBe(403);
    expect((await start(outsider)).status).toBe(403);
  });
});

describe("starting and resuming attempts", () => {
  it("starts a fresh attempt with the full time limit", async () => {
    const res = await start(student);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ resumed: false, remainingSec: 1200, answers: {}, attemptId: null });
  });

  it("resumes the same unfinished attempt with its saved answers instead of using a new one", async () => {
    const first = await start(student);
    const id = first.body.submissionId;
    const save = await api
      .patch(`/api/submissions/${id}/autosave`)
      .set(student.auth)
      .send({ responseJson: { answers: { q14: "viii", q25: "social jet lag" } } });
    expect(save.status).toBe(204);

    const again = await start(student);
    expect(again.status).toBe(200);
    expect(again.body).toMatchObject({ submissionId: id, resumed: true, answers: { q14: "viii", q25: "social jet lag" } });
    expect(await prisma.submission.count({ where: { userId: student.user.id } })).toBe(1);
  });

  it("counts remaining time from the original start", async () => {
    const { body } = await start(student);
    await prisma.submission.update({
      where: { id: body.submissionId },
      data: { startedAt: new Date(Date.now() - 300_000) },
    });
    const again = await start(student);
    expect(again.body.remainingSec).toBeGreaterThanOrEqual(898);
    expect(again.body.remainingSec).toBeLessThanOrEqual(900);
  });

  it("submits saved answers when the time has run out, and reports it", async () => {
    const { body } = await start(student);
    await api
      .patch(`/api/submissions/${body.submissionId}/autosave`)
      .set(student.auth)
      .send({ responseJson: { answers: { q14: "viii" } } });
    await prisma.submission.update({
      where: { id: body.submissionId },
      data: { startedAt: new Date(Date.now() - 2 * 3600_000) },
    });

    const res = await start(student);
    expect(res.status).toBe(409);
    expect(res.body.submissionId).toBe(body.submissionId);
    const sub = await prisma.submission.findUnique({ where: { id: body.submissionId }, include: { grade: true } });
    expect(sub).toMatchObject({ status: "GRADED", rawScore: 1 });
    expect(sub!.grade).not.toBeNull();
  });

  it("enforces the attempt limit once attempts are finished", async () => {
    for (let i = 0; i < 2; i++) {
      const { body } = await start(student);
      expect((await submit(student, body.submissionId, {})).status).toBe(200);
    }
    const res = await start(student);
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/No attempts remaining/);
  });

  it("keeps each student's attempts separate", async () => {
    const a = await start(student);
    const b = await start(otherStudent);
    expect(a.body.submissionId).not.toBe(b.body.submissionId);
    expect(b.body.resumed).toBe(false);
  });
});

describe("submitting and grading", () => {
  it("grades with the answer key and scales a 13-question passage to a band", async () => {
    const { body } = await start(student);
    const correct = Object.fromEntries(Object.entries(key).map(([q, a]) => [q, [a].flat()[0]]));
    const res = await submit(student, body.submissionId, correct);
    expect(res.status).toBe(200);
    expect(res.body.submission).toMatchObject({ status: "GRADED", rawScore: 13 });
    expect(res.body.grade.band).toBe(9);
  });

  it("refuses a second submit and further autosaves", async () => {
    const { body } = await start(student);
    await submit(student, body.submissionId, {});
    expect((await submit(student, body.submissionId, {})).status).toBe(409);
    const save = await api
      .patch(`/api/submissions/${body.submissionId}/autosave`)
      .set(student.auth)
      .send({ responseJson: { answers: {} } });
    expect(save.status).toBe(409);
  });

  it("does not let another student submit or autosave someone else's attempt", async () => {
    const { body } = await start(student);
    expect((await submit(otherStudent, body.submissionId, {})).status).toBe(403);
    const save = await api
      .patch(`/api/submissions/${body.submissionId}/autosave`)
      .set(otherStudent.auth)
      .send({ responseJson: { answers: {} } });
    expect(save.status).toBe(403);
  });
});

describe("answer review", () => {
  async function finished(answers: Record<string, string>) {
    const { body } = await start(student);
    await submit(student, body.submissionId, answers);
    return body.submissionId as string;
  }

  it("is unavailable until the attempt is submitted, so it cannot leak answers mid-test", async () => {
    const { body } = await start(student);
    const res = await api.get(`/api/submissions/${body.submissionId}/review`).set(student.auth);
    expect(res.status).toBe(409);
    expect(JSON.stringify(res.body)).not.toContain("correctAnswer");
  });

  it("returns per-question results with numbering, types and a per-type summary", async () => {
    const id = await finished({ q14: "viii", q15: "i", q25: "  Social Jet Lag " });
    const res = await api.get(`/api/submissions/${id}/review`).set(student.auth);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ score: 2, total: 13, taskId: passageTaskId });
    const qs = res.body.sections[0].questions;
    expect(qs.map((q: { number: number }) => q.number)).toEqual(Array.from({ length: 13 }, (_, i) => 14 + i));
    expect(qs[0]).toMatchObject({ id: "q14", kind: "Matching headings", given: "viii", correctAnswer: "viii", correct: true });
    expect(qs[1]).toMatchObject({ id: "q15", given: "i", correctAnswer: "iv", correct: false });
    expect(qs[2]).toMatchObject({ id: "q16", given: null, correct: false });
    expect(res.body.byKind).toContainEqual({ kind: "Sentence completion", correct: 1, total: 2 });
    const totals = res.body.byKind.reduce((n: number, k: { total: number }) => n + k.total, 0);
    expect(totals).toBe(13);
  });

  it("agrees with the stored raw score", async () => {
    const id = await finished({ q14: "viii", q20: "f", q26: "ILLNESS" });
    const review = await api.get(`/api/submissions/${id}/review`).set(student.auth);
    const sub = await prisma.submission.findUnique({ where: { id } });
    expect(review.body.score).toBe(sub!.rawScore);
    expect(review.body.score).toBe(3);
  });

  it("is visible to the course's teacher but not to other students or teachers", async () => {
    const id = await finished({});
    expect((await api.get(`/api/submissions/${id}/review`).set(teacher.auth)).status).toBe(200);
    expect((await api.get(`/api/submissions/${id}/review`).set(otherStudent.auth)).status).toBe(403);
    expect((await api.get(`/api/submissions/${id}/review`).set(otherTeacher.auth)).status).toBe(403);
  });

  it("returns 404 for an unknown attempt", async () => {
    expect((await api.get(`/api/submissions/does-not-exist/review`).set(student.auth)).status).toBe(404);
  });
});

describe("monitored mock test", () => {
  it("creates a monitored attempt and requests auto-submit on the second violation", async () => {
    const { body } = await start(student, mockTaskId);
    expect(body.attemptId).toBeTruthy();
    expect(body.lockdownEnabled).toBe(true);

    const v1 = await api.post(`/api/attempts/${body.attemptId}/violations`).set(student.auth).send({ type: "TAB_BLUR" });
    expect(v1.body).toEqual({ violationCount: 1, shouldAutoSubmit: false });
    const v2 = await api
      .post(`/api/attempts/${body.attemptId}/violations`)
      .set(student.auth)
      .send({ type: "FULLSCREEN_EXIT" });
    expect(v2.body).toEqual({ violationCount: 2, shouldAutoSubmit: true });
  });

  it("flags auto-submission and stops recording violations once the test has ended", async () => {
    const { body } = await start(student, mockTaskId);
    expect((await api.post(`/api/attempts/${body.attemptId}/force-submit`).set(student.auth)).status).toBe(200);
    const res = await submit(student, body.submissionId, {});
    expect(res.status).toBe(200);

    const attempt = await prisma.testAttempt.findUnique({ where: { id: body.attemptId } });
    expect(attempt).toMatchObject({ autoSubmitted: true });
    expect(attempt!.endedAt).not.toBeNull();

    const late = await api.post(`/api/attempts/${body.attemptId}/violations`).set(student.auth).send({ type: "TAB_BLUR" });
    expect(late.status).toBe(409);
    expect(await prisma.violation.count({ where: { testAttemptId: body.attemptId } })).toBe(0);
  });

  it("rejects violation logs from anyone but the test taker, and unknown violation types", async () => {
    const { body } = await start(student, mockTaskId);
    const other = await api.post(`/api/attempts/${body.attemptId}/violations`).set(otherStudent.auth).send({ type: "TAB_BLUR" });
    expect(other.status).toBe(403);
    const bad = await api.post(`/api/attempts/${body.attemptId}/violations`).set(student.auth).send({ type: "NOPE" });
    expect(bad.status).toBe(400);
  });

  it("scores the full 40-question mock without scaling", async () => {
    const { body } = await start(student, mockTaskId);
    const fullKey = JSON.parse((await prisma.answerKey.findUnique({ where: { taskId: mockTaskId } }))!.keyJson);
    const answers = Object.fromEntries(
      Object.entries(fullKey).slice(0, 30).map(([q, a]) => [q, [a as string | string[]].flat()[0]])
    );
    const res = await submit(student, body.submissionId, answers);
    expect(res.body.submission.rawScore).toBe(30);
    expect(res.body.grade.band).toBe(7);
  });
});

describe("results list", () => {
  it("lists only the student's own attempts, newest first, including ones in progress", async () => {
    const a = await start(student);
    await submit(student, a.body.submissionId, {});
    await start(student, mockTaskId);
    await start(otherStudent);
    const res = await api.get("/api/students/me/results").set(student.auth);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((s: { userId: string }) => s.userId === student.user.id)).toBe(true);
    expect(res.body[0].status).toBe("IN_PROGRESS");
  });
});
