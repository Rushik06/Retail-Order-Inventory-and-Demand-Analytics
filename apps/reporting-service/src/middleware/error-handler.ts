import type { Request, Response, NextFunction } from "express";

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

  const statusCode = 500;

  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message
  });

};