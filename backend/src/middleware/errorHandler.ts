import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation failed", details: err.issues });
  }
  if (err instanceof Error) {
    if (err.message === "EMAIL_IN_USE") {
      return res.status(409).json({ error: "Email already in use" });
    }
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Not found" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}

// Wraps an async route handler so thrown errors reach errorHandler instead of
// crashing the process (Express doesn't catch rejected promises on its own).
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
