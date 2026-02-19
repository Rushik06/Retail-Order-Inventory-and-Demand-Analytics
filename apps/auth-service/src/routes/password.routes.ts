import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validation/password.schema.js';
import { PasswordRepository } from '../repository/password.repository.js';
import { PasswordService } from '../services/password.service.js';
import { PasswordController } from '../controller/password.controller.js';

const router: Router = Router();

const repository = new PasswordRepository();
const service = new PasswordService(repository);
const controller = new PasswordController(service);

/**
 * @swagger
 * tags:
 *   name: Password
 *   description: Password management APIs
 */

/**
 * @swagger
 * /api/password/change:
 *   patch:
 *     summary: Change password (logged-in user)
 *     tags: [Password]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized / Invalid password
 */
router.patch(
  '/change',
  authenticate,
  validate(changePasswordSchema),
  controller.changePassword
);

/**
 * @swagger
 * /api/password/forgot:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.post(
  '/forgot',
  validate(forgotPasswordSchema),
  controller.forgotPassword
);

/**
 * @swagger
 * /api/password/reset:
 *   patch:
 *     summary: Reset password using OTP
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP or validation error
 */
router.patch(
  '/reset',
  validate(resetPasswordSchema),
  controller.resetPassword
);

export default router;