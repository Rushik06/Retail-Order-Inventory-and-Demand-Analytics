import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { RbacService } from '../services/rbac.service.js';

export class RbacController {
  constructor(private readonly service: RbacService) {}

  checkAccess =
    (allowedRoles: string[]) =>
    async (
      req: AuthenticatedRequest,
      res: Response
    ): Promise<Response> => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const hasAccess = await this.service.hasAccess(
          req.user.id,
          allowedRoles
        );

        if (!hasAccess) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        return res.status(200).json({
          message: 'Access granted',
        });
      } catch {
        return res.status(500).json({
          error: 'Internal server error',
        });
      }
    };
}