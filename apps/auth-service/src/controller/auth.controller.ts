import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor(private readonly service: AuthService) { }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.service.register(req.body);
      return res.status(201).json(result);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
        return res.status(409).json({ error: 'Email already exists' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.service.login(req.body);
      return res.status(200).json(result);
    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);

      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  };

  refresh = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.service.refresh(req.body.refreshToken);
      return res.status(200).json(result);
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    await this.service.logout(req.body.refreshToken);
    return res.status(200).json({ message: 'Logged out successfully' });
  };
  getUsers = async (_req: Request, res: Response): Promise<Response> => {
    try {

      const users = await this.service.getUsers();

      return res.status(200).json(users);

    } catch (error) {

      console.error("GET USERS ERROR:", error);

      return res.status(500).json({
        error: "Failed to fetch users"
      });

    }
  };
}