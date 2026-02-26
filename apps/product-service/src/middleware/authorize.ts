/*eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from "express";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;

    console.log("Authorize Middleware Triggered");
    console.log("User object:", user);
    console.log("User role:", user?.role);
    console.log("Allowed roles:", allowedRoles);

    if (!user) {
      console.log("No user found on request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      console.log("Role mismatch - Forbidden");
      return res.status(403).json({ message: "Forbidden" });
    }

    console.log("Authorization passed");
    next();
  };