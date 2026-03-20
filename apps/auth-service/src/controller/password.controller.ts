import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { PasswordService } from "../services/password.service.js";

export class PasswordController {
  constructor(private readonly service: PasswordService) {}

  changePassword = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {

    const result = await this.service.changePassword(
      req.user!.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    return res.status(200).json(result);
  };

  forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {

    const result = await this.service.forgotPassword(req.body.email);
    return res.status(200).json(result);
  };

  resetPassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {

    const result = await this.service.resetPassword(
      req.body.email,
      req.body.otp,
      req.body.newPassword
    );

    return res.status(200).json(result);
  };
}