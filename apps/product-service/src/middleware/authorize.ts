import type { Request, Response, NextFunction } from "express";
import { logger } from "@repo/shared";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {

    /*eslint-disable @typescript-eslint/no-explicit-any */
    const user = (req as any).user;

    if (!user) {
      logger.warn({ path: req.path }, "No user found on request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      logger.warn({ role: user.role, allowedRoles, path: req.path }, "Role mismatch - Forbidden");
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };