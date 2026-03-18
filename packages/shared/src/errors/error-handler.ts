import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

interface HttpError extends Error {
  statusCode?: number;
  status?: number;
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
    const httpError = err as HttpError;
    statusCode = httpError.statusCode ?? httpError.status ?? 500;
  }

  console.error("GLOBAL ERROR:", err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" &&
      err instanceof Error && {
        stack: err.stack,
      }),
  });
};