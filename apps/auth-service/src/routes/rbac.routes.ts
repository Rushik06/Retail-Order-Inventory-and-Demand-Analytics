import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { RbacService } from '../services/rbac.service.js';
import { RbacController } from '../controller/rbac.controller.js';
import { assignRole } from '../controller/role.controller.js';
import { authorizeRole } from '../middleware/rbac.middleware.js';

const router: Router = Router();

const service = new RbacService();
const controller = new RbacController(service);


router.get(
  '/admin-only',
  authenticate,
  controller.checkAccess(['admin'])
);


router.get(
  '/super-admin-only',
  authenticate,
  controller.checkAccess(['super_admin'])
);


router.post(
  '/assign-role',
  authenticate,
  authorizeRole('admin', 'super_admin'),
  assignRole
);

export default router;