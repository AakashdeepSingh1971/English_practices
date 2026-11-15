/**
 * Loads ../deploy.env (repo root) for the deploy:setup and deploy:check scripts.
 * It is read on its own, so backend/.env (your local database) is never mixed in.
 */
import fs from "node:fs";
import path from "node:path";
import { parse } from "dotenv";

// DEPLOY_ENV_FILE points the scripts at another file (used to test them locally).
export const DEPLOY_ENV_PATH = path.resolve(process.env.DEPLOY_ENV_FILE ?? path.resolve(__dirname, "../../deploy.env"));

export const VERCEL_KEYS = ["DATABASE_URL", "DIRECT_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"] as const;
export const LOCAL_KEYS = ["TEACHER_EMAIL", "TEACHER_NAME", "TEACHER_PASSWORD", "APP_URL"] as const;

export type DeployEnv = Record<(typeof VERCEL_KEYS)[number] | (typeof LOCAL_KEYS)[number], string>;

export function loadDeployEnv(): DeployEnv {
  if (!fs.existsSync(DEPLOY_ENV_PATH)) {
    console.error(`Missing ${DEPLOY_ENV_PATH}. See docs/DEPLOY.md.`);
    process.exit(1);
  }
  const raw = parse(fs.readFileSync(DEPLOY_ENV_PATH));
  const out = {} as DeployEnv;
  for (const k of [...VERCEL_KEYS, ...LOCAL_KEYS]) out[k] = (raw[k] ?? "").trim();
  return out;
}

export const hasPlaceholder = (v: string) => v === "" || /<[^>]+>/.test(v);

/** Hides the password in a postgres URL so it can be printed. */
export function redactUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.password) u.password = "****";
    return u.toString();
  } catch {
    return "(not a valid URL)";
  }
}
