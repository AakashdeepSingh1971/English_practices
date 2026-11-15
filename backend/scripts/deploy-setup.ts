/**
 * One-time setup of the live (Supabase) database from deploy.env:
 *   1. create the tables (prisma migrate deploy; a no-op if Vercel already did it)
 *   2. create your teacher account (TEACHER_EMAIL / TEACHER_PASSWORD)
 *   3. add the reading practice tests
 *
 *   npm run deploy:setup      (from the repo root or backend/)
 *
 * Safe to run again: it never deletes tests that have submissions, and it
 * resets the teacher's password to TEACHER_PASSWORD.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { hasPlaceholder, loadDeployEnv, redactUrl } from "./deploy-env";

const env = loadDeployEnv();
const needed = ["DIRECT_URL", "TEACHER_EMAIL", "TEACHER_NAME", "TEACHER_PASSWORD"] as const;
const missing = needed.filter((k) => hasPlaceholder(env[k]));
if (missing.length) {
  console.error(`Fill these in deploy.env first: ${missing.join(", ")}`);
  process.exit(1);
}

const backendDir = path.resolve(__dirname, "..");
// Scripts use the session pooler for everything: it supports migrations and
// prepared statements, unlike the transaction pooler the app uses.
const childEnv = {
  ...process.env,
  DATABASE_URL: env.DIRECT_URL,
  DIRECT_URL: env.DIRECT_URL,
  TEACHER_EMAIL: env.TEACHER_EMAIL,
  TEACHER_PASSWORD: env.TEACHER_PASSWORD,
};

function run(title: string, args: string[]) {
  console.log(`\n▶ ${title}`);
  const r = spawnSync("npx", args, { cwd: backendDir, env: childEnv, stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`\n✗ "${title}" failed. Nothing after it was run.`);
    process.exit(r.status ?? 1);
  }
}

console.log(`Setting up ${redactUrl(env.DIRECT_URL)}`);
run("Create or update tables", ["prisma", "migrate", "deploy"]);
run(`Create teacher ${env.TEACHER_EMAIL}`, ["tsx", "prisma/create-teacher.ts", env.TEACHER_EMAIL, env.TEACHER_NAME]);
run("Add reading practice tests", ["tsx", "prisma/seed-reading.ts"]);
console.log("\n✓ Setup done. Next: npm run deploy:check");
