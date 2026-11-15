/**
 * Runs a real PostgreSQL server for local development, no install needed
 * (binaries come from the embedded-postgres npm package). Data persists in
 * backend/.pgdata between runs. Keep it running in its own terminal.
 *
 *   npm run db:local
 *
 * Matching backend/.env:
 *   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/ielts"
 *   DIRECT_URL="postgresql://postgres:postgres@localhost:5433/ielts"
 */
import fs from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const dataDir = path.resolve(__dirname, "../.pgdata");
const port = Number(process.env.LOCAL_PG_PORT ?? 5433);

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    port,
    user: "postgres",
    password: "postgres",
    persistent: true,
    onLog: () => {},
  });
  if (!fs.existsSync(path.join(dataDir, "PG_VERSION"))) await pg.initialise();
  await pg.start();
  try {
    await pg.createDatabase("ielts");
  } catch {
    // already exists
  }
  console.log(`Local Postgres running: postgresql://postgres:postgres@localhost:${port}/ielts (Ctrl+C to stop)`);

  const stop = async () => {
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
