import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;

  // Check header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  try {
    //  Verify JWT
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET as string
    ) as unknown as { id: string };

    //  Attach user to request
    req.user = {
      id: decoded.id,
    };

    next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};