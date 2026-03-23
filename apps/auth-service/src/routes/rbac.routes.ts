import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { RbacService } from '../services/rbac.service.js';
import { RbacController } from '../controller/rbac.controller.js';
import { assignRole } from '../controller/role.controller.js';
import { authorizeRole } from '../middleware/rbac.middleware.js';
import { requestRoleAccess } from '../controller/request-role.controller.js';

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

//Assign Role
router.post(
  '/assign-role',
  authenticate,
  authorizeRole('admin', 'super_admin'),
  assignRole
);

//Request access
router.post(
  "/request-role",
  authenticate,
  requestRoleAccess
);
export default router;