import { defineConfig } from "vitest/config";

// Tests run against a throwaway PostgreSQL started in tests/globalSetup.ts and
// recreated from the Prisma schema on every run. Never the dev or production database.
const testDb = process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:54329/ielts_test";
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globalSetup: ["tests/globalSetup.ts"],
    fileParallelism: false,
    env: {
      DATABASE_URL: testDb,
      DIRECT_URL: testDb,
      JWT_ACCESS_SECRET: "test-access-secret",
      JWT_REFRESH_SECRET: "test-refresh-secret",
      FRONTEND_ORIGIN: "http://localhost:5173",
    },
  },
});
