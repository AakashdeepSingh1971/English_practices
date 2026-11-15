import type { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import type { Role } from "../types/enums";

// Re-derives the role from the DB rather than trusting the JWT claim alone,
// so a role change (e.g. demotion) takes effect immediately on writes.
export function requireRole(...allowed: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const dbUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!dbUser || !allowed.includes(dbUser.role as Role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user.role = dbUser.role as Role;
    next();
  };
}
