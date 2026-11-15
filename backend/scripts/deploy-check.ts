/**
 * Tests a Vercel + Supabase deployment using the values in deploy.env.
 *
 *   npm run deploy:check      (from the repo root or backend/)
 *
 * Phase 1  env file   every value filled in and in the right format
 * Phase 2  database   both Supabase addresses connect, tables exist, teacher and tests are there
 * Phase 3  live site  pages, API, login, cookies, and a full test taken by a temporary
 *                     student, which is deleted again at the end
 *
 * Each phase needs the one before it. Exit code 0 means everything passed.
 */
import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { DEPLOY_ENV_PATH, hasPlaceholder, loadDeployEnv, redactUrl, VERCEL_KEYS, LOCAL_KEYS } from "./deploy-env";
import { READING_TESTS } from "../prisma/reading/tests";

const env = loadDeployEnv();
let failures = 0;
let warnings = 0;

const pass = (msg: string) => console.log(`  ✓ ${msg}`);
const fail = (msg: string, hint?: string) => {
  failures++;
  console.log(`  ✗ ${msg}${hint ? `\n      → ${hint}` : ""}`);
};
const warn = (msg: string, hint?: string) => {
  warnings++;
  console.log(`  ! ${msg}${hint ? `\n      → ${hint}` : ""}`);
};
const skip = (msg: string) => console.log(`  - skipped: ${msg}`);
const check = (ok: boolean, msg: string, hint?: string) => (ok ? pass(msg) : fail(msg, hint));
const heading = (s: string) => console.log(`\n${s}`);

function parseUrl(v: string): URL | null {
  try {
    return new URL(v);
  } catch {
    return null;
  }
}

// ───────────────────────── Phase 1: env file ─────────────────────────
function phase1(): { dbOk: boolean; appOk: boolean } {
  heading("Phase 1 · deploy.env");
  const start = failures;

  for (const k of [...VERCEL_KEYS, ...LOCAL_KEYS]) {
    if (hasPlaceholder(env[k])) fail(`${k} is not filled in`, `replace the <...> part in deploy.env`);
  }

  let dbOk = true;
  const pooled = parseUrl(env.DATABASE_URL);
  const direct = parseUrl(env.DIRECT_URL);
  if (hasPlaceholder(env.DATABASE_URL) || hasPlaceholder(env.DIRECT_URL)) dbOk = false;
  else if (!pooled || !direct) {
    fail("DATABASE_URL and DIRECT_URL must be postgresql:// addresses");
    dbOk = false;
  } else {
    const dbStart = failures;
    const isPg = (u: URL) => u.protocol === "postgresql:" || u.protocol === "postgres:";
    check(isPg(pooled) && isPg(direct), "both database addresses start with postgresql://");
    check(
      pooled.port === "6543",
      "DATABASE_URL uses the transaction pooler (port 6543)",
      "Supabase → Connect → Transaction pooler"
    );
    check(
      pooled.searchParams.get("pgbouncer") === "true" && pooled.searchParams.get("connection_limit") === "1",
      "DATABASE_URL ends with ?pgbouncer=true&connection_limit=1"
    );
    check(
      direct.port === "5432" && !direct.hostname.startsWith("db."),
      "DIRECT_URL uses the session pooler (port 5432, *.pooler.supabase.com)",
      'not the "Direct connection" (db.<ref>.supabase.co): Vercel cannot reach it'
    );
    check(
      pooled.username === direct.username && pooled.password === direct.password,
      "both addresses use the same user and password"
    );
    const isPlaceholderPw = (u: URL) => u.password.includes("[") || u.password.toUpperCase().includes("YOUR-PASSWORD");
    if (isPlaceholderPw(pooled) || isPlaceholderPw(direct)) {
      fail("the password is still Supabase's placeholder", "replace [YOUR-PASSWORD] with your database password");
    }
    if (/[@:/?#]/.test(decodeURIComponent(pooled.password)) && pooled.password === decodeURIComponent(pooled.password)) {
      warn("the database password has special characters", "URL-encode it (e.g. @ → %40) or reset it in Supabase to letters and digits");
    }
    dbOk = failures === dbStart;
  }

  if (!hasPlaceholder(env.JWT_ACCESS_SECRET) && !hasPlaceholder(env.JWT_REFRESH_SECRET)) {
    check(
      env.JWT_ACCESS_SECRET.length >= 32 && env.JWT_REFRESH_SECRET.length >= 32,
      "JWT secrets are at least 32 characters"
    );
    check(env.JWT_ACCESS_SECRET !== env.JWT_REFRESH_SECRET, "the two JWT secrets are different");
  }
  if (!hasPlaceholder(env.TEACHER_EMAIL)) {
    check(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(env.TEACHER_EMAIL), "TEACHER_EMAIL is an email address");
  }
  if (!hasPlaceholder(env.TEACHER_PASSWORD)) {
    check(env.TEACHER_PASSWORD.length >= 12, "TEACHER_PASSWORD is at least 12 characters");
  }

  let appOk = false;
  if (!hasPlaceholder(env.APP_URL)) {
    const app = parseUrl(env.APP_URL);
    appOk = !!app && app.protocol === "https:" && (app.pathname === "/" || app.pathname === "");
    check(appOk, "APP_URL is an https:// address with no path", "e.g. https://english-practices.vercel.app");
  }

  if (failures === start) pass("deploy.env looks right");
  return { dbOk, appOk };
}

// ───────────────────────── Phase 2: database ─────────────────────────
interface Fixture {
  teacherId: string;
  courseId: string;
  taskId: string;
  key: Record<string, string | string[]>;
}

async function ping(label: string, url: string): Promise<PrismaClient | null> {
  const client = new PrismaClient({ datasources: { db: { url } } });
  const t = Date.now();
  try {
    await client.$queryRawUnsafe("SELECT 1");
    pass(`${label} connects (${Date.now() - t} ms) · ${redactUrl(url)}`);
    return client;
  } catch (e) {
    const msg = (e as Error).message.split("\n").filter(Boolean).pop() ?? "";
    let hint = "check the address and password in deploy.env";
    if (/password authentication failed|Tenant or user not found|valid database credentials/i.test(msg)) hint = "wrong password or project ref";
    else if (/Can't reach|ENOTFOUND|timed out|server is running/i.test(msg)) hint = "wrong host, or the Supabase project is paused (resume it in the dashboard)";
    fail(`${label} does not connect: ${msg.slice(0, 160)}`, hint);
    await client.$disconnect();
    return null;
  }
}

async function phase2(dbOk: boolean): Promise<{ admin: PrismaClient | null; fixture: Fixture | null }> {
  heading("Phase 2 · Supabase database");
  if (!dbOk) {
    skip("fix DATABASE_URL / DIRECT_URL in phase 1 first");
    return { admin: null, fixture: null };
  }

  const admin = await ping("DIRECT_URL (session pooler)", env.DIRECT_URL);
  const app = await ping("DATABASE_URL (transaction pooler)", env.DATABASE_URL);
  if (app) {
    // The app's real query path: Prisma through PgBouncer.
    try {
      await app.user.count();
      await app.user.count();
      pass("Prisma queries work through the transaction pooler");
    } catch (e) {
      const msg = (e as Error).message;
      if (/does not exist/.test(msg)) pass("transaction pooler accepts Prisma queries (tables come next)");
      else fail(`Prisma query through the transaction pooler failed: ${msg.slice(0, 160)}`, "is ?pgbouncer=true on DATABASE_URL?");
    }
    await app.$disconnect();
  }
  if (!admin) return { admin: null, fixture: null };

  // Tables
  const expected = fs
    .readdirSync(path.resolve(__dirname, "../prisma/migrations"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  let applied: string[] = [];
  try {
    const rows = await admin.$queryRawUnsafe<{ migration_name: string }[]>(
      "SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL"
    );
    applied = rows.map((r) => r.migration_name);
  } catch {
    fail("tables have not been created yet", "deploy on Vercel (production) or run npm run deploy:setup");
    return { admin, fixture: null };
  }
  const missing = expected.filter((m) => !applied.includes(m));
  check(missing.length === 0, `all ${expected.length} migration(s) applied`, `missing: ${missing.join(", ")}; redeploy or run npm run deploy:setup`);

  // Demo accounts must never exist in production.
  const demo = await admin.user.count({ where: { email: { in: ["teacher@example.com", "student@example.com"] } } });
  check(demo === 0, "no demo password123 accounts", "npm run seed was run against Supabase; delete those users");

  // Teacher, course and tests
  const teacher = await admin.user.findUnique({ where: { email: env.TEACHER_EMAIL } });
  if (!teacher || teacher.role !== "TEACHER_ADMIN") {
    fail(`teacher ${env.TEACHER_EMAIL} does not exist`, "run npm run deploy:setup");
    return { admin, fixture: null };
  }
  pass(`teacher ${env.TEACHER_EMAIL} exists`);

  const course = await admin.course.findFirst({
    where: { createdById: teacher.id, title: "IELTS Preparation" },
    orderBy: { createdAt: "asc" },
    include: { modules: { where: { type: "READING" }, include: { tasks: { include: { answerKey: true } } } } },
  });
  if (!course) {
    fail("course IELTS Preparation does not exist", "run npm run deploy:setup");
    return { admin, fixture: null };
  }
  pass(`course IELTS Preparation exists · Course ID ${course.id}`);

  const tests = course.modules.filter((m) => m.title.startsWith("Academic Reading — Practice Test"));
  check(
    tests.length >= READING_TESTS.length,
    `${tests.length} reading practice test(s) (expected ${READING_TESTS.length})`,
    "run npm run deploy:setup"
  );
  const broken = tests.filter((m) => m.tasks.length !== 4 || m.tasks.some((t) => !t.answerKey));
  check(broken.length === 0, "every test has 3 passages + 1 mock, all with answer keys", `check: ${broken.map((m) => m.title).join(", ")}`);

  const t1 = tests.find((m) => m.title.endsWith("Test 1"));
  const task = t1?.tasks.find((t) => t.order === 1);
  if (!task?.answerKey) return { admin, fixture: null };
  return {
    admin,
    fixture: { teacherId: teacher.id, courseId: course.id, taskId: task.id, key: JSON.parse(task.answerKey.keyJson) },
  };
}

// ───────────────────────── Phase 3: live site ─────────────────────────
const base = () => env.APP_URL.replace(/\/+$/, "");

async function call(
  method: string,
  p: string,
  opts: { token?: string; body?: unknown; cookie?: string } = {}
): Promise<{ status: number; type: string; json: any; text: string; setCookie: string[] }> {
  const headers: Record<string, string> = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.cookie) headers.Cookie = opts.cookie;
  const res = await fetch(base() + p, {
    method,
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    // not JSON
  }
  return { status: res.status, type: res.headers.get("content-type") ?? "", json, text, setCookie: res.headers.getSetCookie() };
}

async function phase3(appOk: boolean, admin: PrismaClient | null, fx: Fixture | null) {
  heading("Phase 3 · live site");
  if (!appOk) {
    skip("fill in APP_URL (phase 1)");
    return;
  }

  // Pages
  let home;
  try {
    home = await call("GET", "/");
  } catch (e) {
    const cause = ((e as Error).cause as Error | undefined)?.message ?? (e as Error).message;
    fail(`${base()} cannot be reached: ${cause}`, "check APP_URL, and that the Vercel deployment finished");
    return;
  }
  if (home.status === 401 || home.status === 403 || (home.status >= 300 && home.status < 400)) {
    fail(
      `${base()} answers ${home.status} instead of the app`,
      "Vercel → Settings → Deployment Protection: turn off Vercel Authentication, or use the production domain"
    );
    return;
  }
  check(home.status === 200 && home.text.includes('id="root"'), `home page loads (${home.status})`);
  const deep = await call("GET", "/student/results");
  check(deep.status === 200 && deep.text.includes('id="root"'), "reloading a deep link (/student/results) serves the app", "check the rewrites in vercel.json");
  const asset = home.text.match(/\/assets\/[^"']+\.js/)?.[0];
  if (asset) {
    const a = await call("GET", asset);
    check(a.status === 200 && /javascript/.test(a.type), `script bundle loads (${asset})`);
  }

  // API basics
  const health = await call("GET", "/api/health");
  if (health.status !== 200 || health.json?.ok !== true) {
    fail(
      `API health check failed (${health.status})`,
      health.status === 500
        ? "a variable is missing in Vercel; look at Vercel → Logs, add it, then Redeploy"
        : "check the /api rewrite in vercel.json and the function logs"
    );
    return;
  }
  pass("API is running (/api/health)");

  const bad = await call("POST", "/api/auth/login", { body: { email: env.TEACHER_EMAIL, password: "definitely-wrong-password" } });
  if (bad.status === 500) {
    fail("login returns 500: the API cannot use the database", "DATABASE_URL in Vercel differs from deploy.env, or tables are missing; see Vercel → Logs");
    return;
  }
  check(bad.status === 401, "a wrong password is rejected (401)");

  // Teacher login + refresh cookie
  const login = await call("POST", "/api/auth/login", { body: { email: env.TEACHER_EMAIL, password: env.TEACHER_PASSWORD } });
  let teacherToken: string | undefined;
  if (login.status === 200 && login.json?.user?.role === "TEACHER_ADMIN") {
    teacherToken = login.json.accessToken;
    pass(`teacher ${env.TEACHER_EMAIL} can log in`);
    const cookie = login.setCookie.find((c) => c.startsWith("refreshToken="));
    if (!cookie) fail("login did not set the refresh cookie");
    else {
      check(/;\s*HttpOnly/i.test(cookie), "refresh cookie is HttpOnly");
      check(/;\s*Secure/i.test(cookie), "refresh cookie is Secure", "NODE_ENV is not production on Vercel");
      check(/;\s*Path=\/api\/auth/i.test(cookie), "refresh cookie is limited to /api/auth");
      const refreshed = await call("POST", "/api/auth/refresh", { cookie: cookie.split(";")[0] });
      check(refreshed.status === 200 && !!refreshed.json?.accessToken, "staying signed in after a reload works (/api/auth/refresh)");
    }
  } else {
    fail(`teacher login failed (${login.status})`, "TEACHER_PASSWORD changed? Run npm run deploy:setup to reset it");
  }

  if (teacherToken) {
    const nope = await call("GET", "/api/does-not-exist", { token: teacherToken });
    check(nope.status === 404 && /json/.test(nope.type), "unknown API routes give a JSON 404");
  }

  // The secrets in Vercel must match deploy.env (a token signed here must work there).
  if (login.json?.user?.id) {
    const local = jwt.sign({ sub: login.json.user.id, role: "TEACHER_ADMIN" }, env.JWT_ACCESS_SECRET, { expiresIn: "2m" });
    const r = await call("GET", "/api/courses", { token: local });
    check(r.status === 200, "JWT_ACCESS_SECRET in Vercel matches deploy.env", "copy it from deploy.env into Vercel again, then Redeploy");
  }

  // Full student journey with a temporary account, removed at the end.
  if (!admin || !fx) {
    skip("student test run (needs phase 2: teacher, course and tests)");
    return;
  }
  const email = `deploy-check-${Date.now().toString(36)}@example.invalid`;
  try {
    const reg = await call("POST", "/api/auth/register", {
      body: { email, password: "deploy-check-password", name: "Deploy Check", role: "TEACHER_ADMIN" },
    });
    if (reg.status !== 201) {
      fail(`student sign-up failed (${reg.status}) ${reg.text.slice(0, 120)}`);
      return;
    }
    check(reg.json.user.role === "STUDENT", "sign-up creates a student, even when asked for teacher");
    const token = reg.json.accessToken as string;

    const enroll = await call("POST", `/api/courses/${fx.courseId}/enroll`, { token });
    check(enroll.status === 201, "student can enroll with the Course ID");

    const start = await call("POST", `/api/tasks/${fx.taskId}/attempts/start`, { token });
    if (start.status !== 201) {
      fail(`starting T1 Passage 1 failed (${start.status})`);
      return;
    }
    pass(`starting T1 Passage 1 works (timer ${Math.round(start.json.timeLimitSec / 60)} min)`);

    const answers = Object.fromEntries(Object.entries(fx.key).map(([q, a]) => [q, [a].flat()[0]]));
    const saved = await call("PATCH", `/api/submissions/${start.json.submissionId}/autosave`, { token, body: { responseJson: { answers } } });
    check(saved.status === 204, "autosave works");
    const resumed = await call("POST", `/api/tasks/${fx.taskId}/attempts/start`, { token });
    check(
      resumed.json?.resumed === true && Object.keys(resumed.json.answers ?? {}).length === Object.keys(answers).length,
      "leaving and coming back resumes the attempt with saved answers"
    );

    const submit = await call("POST", `/api/submissions/${start.json.submissionId}/submit`, { token, body: { responseJson: { answers } } });
    const n = Object.keys(fx.key).length;
    check(
      submit.status === 200 && submit.json.submission?.rawScore === n && submit.json.grade?.band === 9,
      `all-correct answers grade as ${n}/${n}, band 9`,
      `got ${submit.status} ${JSON.stringify(submit.json?.submission?.rawScore)} / band ${submit.json?.grade?.band}`
    );

    const review = await call("GET", `/api/submissions/${start.json.submissionId}/review`, { token });
    check(review.status === 200, "student can open the answer review");
    if (teacherToken) {
      const tReview = await call("GET", `/api/submissions/${start.json.submissionId}/review`, { token: teacherToken });
      check(tReview.status === 200, "teacher can open the student's review");
    }
    const results = await call("GET", "/api/students/me/results", { token });
    check(results.status === 200 && results.json.length === 1, "the attempt appears in My results");
  } catch (e) {
    fail(`live test crashed: ${(e as Error).message}`);
  } finally {
    // Remove the temporary student and everything it created.
    const user = await admin.user.findUnique({ where: { email } });
    if (user) {
      const where = { submission: { userId: user.id } };
      await admin.$transaction([
        admin.violation.deleteMany({ where: { testAttempt: where } }),
        admin.testAttempt.deleteMany({ where }),
        admin.grade.deleteMany({ where }),
        admin.submission.deleteMany({ where: { userId: user.id } }),
        admin.enrollment.deleteMany({ where: { userId: user.id } }),
        admin.user.delete({ where: { id: user.id } }),
      ]);
      pass("temporary student removed");
    }
  }
}

async function main() {
  console.log(`Checking deployment using ${DEPLOY_ENV_PATH}`);
  const { dbOk, appOk } = phase1();
  const { admin, fixture } = await phase2(dbOk);
  try {
    await phase3(appOk, admin, fixture);
  } finally {
    await admin?.$disconnect();
  }
  console.log(
    failures === 0
      ? `\n✓ All checks passed${warnings ? ` (${warnings} warning(s))` : ""}.`
      : `\n✗ ${failures} check(s) failed${warnings ? `, ${warnings} warning(s)` : ""}. Fix the first ✗ above, then run this again.`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
