import "dotenv/config";
import path from "node:path";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  // Only needed when the frontend is served from a different origin (e.g. a
  // separately hosted site). In the single deployment the API and the app
  // share one origin, so no cross-origin requests happen.
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  // Built frontend served by this server. src/config and dist/config are both
  // three levels below the repo root, so this resolves the same in dev and prod.
  staticDir: process.env.STATIC_DIR ?? path.resolve(__dirname, "../../../frontend/dist"),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-opus-4-5",
};
