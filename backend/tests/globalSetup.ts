import { execSync } from "node:child_process";

export default function setup() {
  execSync("npx prisma db push --force-reset --skip-generate", {
    cwd: new URL("..", import.meta.url).pathname,
    env: { ...process.env, DATABASE_URL: "file:./test.db" },
    stdio: "pipe",
  });
}
