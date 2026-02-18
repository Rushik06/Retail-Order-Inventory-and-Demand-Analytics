import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validation/profile.schema.js';
import { ProfileRepository } from '../repository/profile.repository.js';
import { ProfileService } from '../services/profile.service.js';
import { ProfileController } from '../controller/profile.controller.js';

const router: Router = Router();

const repository = new ProfileRepository();
const service = new ProfileService(repository);
const controller = new ProfileController(service);
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "uuid-1234"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: User not found
 */
router.get('/', authenticate, controller.getProfile);


/**
 * @swagger
 * /api/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch(
  '/',
  authenticate,
  validate(updateProfileSchema),
  controller.updateProfile
);


/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/', authenticate, controller.deleteProfile);