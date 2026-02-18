/*eslint-disable*/ 
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { UserRole } from '../models/userRole.model.js';
import { Role } from '../models/role.model.js';

export const authorizeRole =
  (...allowedRoles: string[]) =>
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    // Fetch role from DB using user_id
    const userRole = await UserRole.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: Role,
          attributes: ['name'],
        },
      ],
    });

    if (!userRole) {
      return res.status(403).json({
        error: 'No role assigned',
      });
    }

    const roleName = (userRole as any).Role?.name;

    if (!allowedRoles.includes(roleName)) {
      return res.status(403).json({
        error: 'Forbidden',
      });
    }

    next();
  };