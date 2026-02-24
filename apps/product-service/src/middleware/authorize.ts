/*eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from "express";

export const authorize =

  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
     
    next();
  };