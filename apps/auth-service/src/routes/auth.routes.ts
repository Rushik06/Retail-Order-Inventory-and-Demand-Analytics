import { Router } from 'express';
import { AuthRepository } from '../repository/auth.repository.js';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controller/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authorizeRole } from '../middleware/rbac.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
} from '../validation/auth.schema.js';

const router: Router = Router();

const repository = new AuthRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 *       400:
 *         description: Validation error
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns access token and sets httpOnly refresh token cookie
 *         headers:
 *           Set-Cookie:
 *             description: httpOnly refresh token cookie (refreshToken)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Reads the refresh token from the httpOnly cookie (set during login). No request body needed. Rotates the refresh token — old one is deleted from Redis, new one is set in cookie.
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: httpOnly refresh token cookie
 *     responses:
 *       200:
 *         description: New access token issued, new refresh token cookie set
 *         headers:
 *           Set-Cookie:
 *             description: Rotated httpOnly refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 *       400:
 *         description: Refresh token cookie missing
 */
router.post('/refresh', controller.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Reads the refresh token from the httpOnly cookie, deletes it from Redis, and clears the cookie. No request body needed.
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: httpOnly refresh token cookie
 *     responses:
 *       200:
 *         description: Successfully logged out, cookie cleared
 *       400:
 *         description: Refresh token cookie missing
 */
router.post('/logout', controller.logout);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/users',
  authenticate,
  authorizeRole('admin', 'super_admin'),
  controller.getUsers,
);

export default router;