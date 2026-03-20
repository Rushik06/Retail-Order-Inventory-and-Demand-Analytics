import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "@repo/shared";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    logger.warn({ path: req.path }, "No token provided in Authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token!,
      process.env.JWT_ACCESS_SECRET as string
    );

    /* eslint-disable @typescript-eslint/no-explicit-any */
    (req as any).user = decoded;
    next();
  } catch (error) {
    logger.warn({ err: error, path: req.path }, "Invalid token provided");
    return res.status(401).json({ message: "Invalid token" });
  }
};