import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { ProfileService } from '../services/profile.service.js';

export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  // GET /profile
  getProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.getProfile(userId);
      return res.status(200).json(result);
    } catch {
      return res.status(404).json({
        error: 'User not found',
      });
    }
  };

  // PATCH /profile
  updateProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.updateProfile(
        userId,
        req.body
      );
      return res.status(200).json(result);
    } catch {
      return res.status(404).json({
        error: 'User not found',
      });
    }
  };

  // DELETE /profile
  deleteProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const userId = req.user?.id as string;
    await this.service.deleteProfile(userId);

    return res.status(200).json({
      message: 'Account deleted successfully',
    });
  };
}