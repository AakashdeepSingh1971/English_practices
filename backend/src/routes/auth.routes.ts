import { Router } from "express";
import { z } from "zod";
import {
  registerUser,
  verifyCredentials,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/auth.service";
import { env } from "../config/env";
import { asyncHandler } from "../middleware/errorHandler";

export const authRouter = Router();

const REFRESH_COOKIE = "refreshToken";
const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: env.isProduction,
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    // Public sign-up always creates a student. Any "role" in the body is ignored;
    // teacher accounts are created on the server with `npm run create-teacher`.
    const { email, password, name } = registerSchema.parse(req.body);
    const user = await registerUser(email, password, name, "STUDENT");
    const payload = { sub: user.id, role: user.role as "STUDENT" | "TEACHER_ADMIN" };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);
    res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const payload = { sub: user.id, role: user.role as "STUDENT" | "TEACHER_ADMIN" };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);
    res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      return res.status(401).json({ error: "Missing refresh token" });
    }
    try {
      const payload = verifyRefreshToken(token);
      const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
      res.json({ accessToken });
    } catch {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
  })
);

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.status(204).send();
});
