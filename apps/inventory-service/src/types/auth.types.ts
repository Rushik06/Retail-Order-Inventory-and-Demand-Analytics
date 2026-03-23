import type { Request } from "express";

export interface JwtPayload {
  id: number;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}