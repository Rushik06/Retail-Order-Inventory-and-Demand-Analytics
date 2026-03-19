import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AppError } from '@repo/shared';
import { COOKIE_OPTIONS } from '../constants/auth.js'; 

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.service.register(req.body);
    return res.status(201).json(result);
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.service.login(req.body);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
    return res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  };

  refresh = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new AppError('Refresh token is required', 400);

    const result = await this.service.refresh(refreshToken);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
    return res.status(200).json({ accessToken: result.accessToken });
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new AppError('Refresh token is required', 400);

    const result = await this.service.logout(refreshToken);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    return res.status(200).json(result);
  };

  getUsers = async (_req: Request, res: Response): Promise<Response> => {
    const users = await this.service.getUsers();
    return res.status(200).json(users);
  };
}