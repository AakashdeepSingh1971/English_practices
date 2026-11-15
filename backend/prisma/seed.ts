import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      email: "teacher@example.com",
      passwordHash,
      name: "Sample Teacher",
      role: "TEACHER_ADMIN",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      passwordHash,
      name: "Sample Student",
      role: "STUDENT",
    },
  });

  const course = await prisma.course.create({
    data: {
      title: "IELTS Preparation",
      description: "Listening, Reading, Writing and Speaking practice toward Band 8+.",
      createdById: teacher.id,
    },
  });

  await prisma.enrollment.create({
    data: { userId: student.id, courseId: course.id },
  });

  const listening = await prisma.module.create({
    data: { courseId: course.id, title: "Listening", type: "LISTENING", order: 1 },
  });
  const reading = await prisma.module.create({
    data: { courseId: course.id, title: "Reading", type: "READING", order: 2 },
  });
  await prisma.module.create({
    data: { courseId: course.id, title: "Writing", type: "WRITING", order: 3 },
  });
  await prisma.module.create({
    data: { courseId: course.id, title: "Speaking", type: "SPEAKING", order: 4 },
  });

  // Sample Listening task — audioUrl is null (no hosted audio wired up in Phase 1 yet);
  // a teacher adds a real hosted audio URL via PUT /api/tasks/:id later.
  const listeningTask = await prisma.task.create({
    data: {
      moduleId: listening.id,
      title: "Section 1 — Note Completion (sample)",
      type: "SHORT_ANSWER",
      order: 1,
      timeLimitSec: 600,
      lockdownEnabled: true,
      contentJson: JSON.stringify({
        instructions: "Listen to the recording and complete the notes below with ONE WORD each.",
        audioUrl: null,
        questions: [
          { id: "q1", prompt: "The visitor's surname is spelled ______.", type: "SHORT_ANSWER" },
          { id: "q2", prompt: "The membership fee is ______ pounds per year.", type: "SHORT_ANSWER" },
          { id: "q3", prompt: "Classes start on a ______ day.", type: "SHORT_ANSWER" },
        ],
      }),
    },
  });
  await prisma.answerKey.create({
    data: {
      taskId: listeningTask.id,
      keyJson: JSON.stringify({ q1: ["Hallett", "hallett"], q2: ["45", "forty-five"], q3: ["Monday", "monday"] }),
    },
  });

  // Sample Reading task.
  const readingTask = await prisma.task.create({
    data: {
      moduleId: reading.id,
      title: "Passage 1 — Multiple Choice (sample)",
      type: "MULTIPLE_CHOICE",
      order: 1,
      timeLimitSec: 1200,
      lockdownEnabled: true,
      contentJson: JSON.stringify({
        instructions: "Read the passage and choose the correct letter, A, B, C or D.",
        passage:
          "Urban green spaces have been shown to improve mental wellbeing and reduce stress in city residents. " +
          "Recent studies suggest that even brief exposure to parks or tree-lined streets correlates with lower " +
          "cortisol levels and improved mood. Urban planners are increasingly incorporating green corridors into " +
          "city designs as a result.",
        questions: [
          {
            id: "q1",
            prompt: "According to the passage, what has been linked to lower cortisol levels?",
            type: "MULTIPLE_CHOICE",
            options: ["A. Longer working hours", "B. Brief exposure to green spaces", "C. Reduced traffic", "D. Higher income"],
          },
          {
            id: "q2",
            prompt: "What are urban planners increasingly doing?",
            type: "MULTIPLE_CHOICE",
            options: ["A. Removing parks", "B. Building taller buildings", "C. Incorporating green corridors", "D. Banning cars"],
          },
        ],
      }),
    },
  });
  await prisma.answerKey.create({
    data: {
      taskId: readingTask.id,
      keyJson: JSON.stringify({ q1: "B", q2: "C" }),
    },
  });

  console.log("Seed complete.");
  console.log("Teacher login: teacher@example.com / password123");
  console.log("Student login: student@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
