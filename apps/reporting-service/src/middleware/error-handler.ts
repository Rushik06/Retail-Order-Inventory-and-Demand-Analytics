import type { Request, Response, NextFunction } from "express";

/* Extend Error safely */

interface AppError extends Error {
  statusCode?: number;
  status?: number;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (res.headersSent) {
    next(err);
    return;
  }

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;

    const customError = err as AppError;

    statusCode =
      customError.statusCode ??
      customError.status ??
      500;
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