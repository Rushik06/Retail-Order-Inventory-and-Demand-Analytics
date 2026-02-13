import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    try {
      const result = await this.service.register({ email, password });
      return res.status(201).json(result);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
        return res.status(409).json({
          error: 'Email already exists',
        });
      }

      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    try {
      const result = await this.service.login({ email, password });
      return res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          error: 'Invalid credentials',
        });
      }

      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  };
}