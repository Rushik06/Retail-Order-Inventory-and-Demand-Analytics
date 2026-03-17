import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (res.headersSent) {
    return next(err);
  }

  console.error("GLOBAL ERROR:", err);

  /* APP ERROR (expected errors) */

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  /* UNKNOWN ERROR */

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};