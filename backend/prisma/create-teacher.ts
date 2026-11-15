/**
 * Creates a teacher account, or resets an existing account's password and
 * makes it a teacher. Public sign-up only creates students, so this is how
 * teachers are added on a deployed server.
 *
 *   TEACHER_PASSWORD='a long password' npm run create-teacher -- you@example.com "Your Name"
 *
 * The password comes from the environment so it doesn't end up in shell history.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [email, ...nameParts] = process.argv.slice(2);
  const name = nameParts.join(" ").trim();
  const password = process.env.TEACHER_PASSWORD ?? "";

  if (!email || !name) {
    throw new Error('Usage: TEACHER_PASSWORD=... npm run create-teacher -- <email> "<full name>"');
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error(`Not a valid email: ${email}`);
  if (password.length < 12) throw new Error("Set TEACHER_PASSWORD to at least 12 characters.");

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.user.findUnique({ where: { email } });
  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: "TEACHER_ADMIN" },
    create: { email, name, passwordHash, role: "TEACHER_ADMIN" },
  });
  console.log(`${existing ? "Updated" : "Created"} teacher ${email}.`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
