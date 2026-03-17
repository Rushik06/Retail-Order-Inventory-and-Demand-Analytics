import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.service.register(req.body);
    return res.status(201).json(result);
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.service.login(req.body);
    return res.status(200).json(result);
  };

  refresh = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.service.refresh(req.body.refreshToken);
    return res.status(200).json(result);
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    await this.service.logout(req.body.refreshToken);
    return res.status(200).json({ message: "Logged out successfully" });
  };

  getUsers = async (_req: Request, res: Response): Promise<Response> => {
    const users = await this.service.getUsers();
    return res.status(200).json(users);
  };
}