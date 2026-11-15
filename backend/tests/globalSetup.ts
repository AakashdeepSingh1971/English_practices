import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

// Tests run against a throwaway PostgreSQL started here (port and URL match
// vitest.config.ts), never the dev or production database. Set
// TEST_DATABASE_URL to use an existing server instead (e.g. in CI).
export default async function setup() {
  const backendDir = new URL("..", import.meta.url).pathname;
  let pg: EmbeddedPostgres | null = null;
  let dataDir: string | null = null;

  if (!process.env.TEST_DATABASE_URL) {
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "ielts-test-pg-"));
    pg = new EmbeddedPostgres({
      databaseDir: dataDir,
      port: 54329,
      user: "postgres",
      password: "postgres",
      persistent: false,
      onLog: () => {},
    });
    await pg.initialise();
    await pg.start();
    await pg.createDatabase("ielts_test");
  }

  const url = process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:54329/ielts_test";
  execSync("npx prisma migrate reset --force --skip-generate --skip-seed", {
    cwd: backendDir,
    env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
    stdio: "pipe",
  });

  return async () => {
    await pg?.stop();
    if (dataDir) fs.rmSync(dataDir, { recursive: true, force: true });
  };
}
