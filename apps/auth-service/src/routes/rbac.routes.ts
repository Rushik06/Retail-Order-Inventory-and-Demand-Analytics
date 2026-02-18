import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { RbacService } from '../services/rbac.service.js';
import { RbacController } from '../controller/rbac.controller.js';

const router : Router = Router();

const service = new RbacService();
const controller = new RbacController(service);

/**
 * @swagger
 * /api/rbac/admin-only:
 *   get:
 *     summary: Only admin and above can access
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500 :
 *          description: Internal Server Error
 */
router.get(
  '/admin-only',
  authenticate,
  controller.checkAccess(['admin'])
);

/**
 * Example:
 * super_admin only
 */
router.get(
  '/super-admin-only',
  authenticate,
  controller.checkAccess(['super_admin'])
);

export default router;