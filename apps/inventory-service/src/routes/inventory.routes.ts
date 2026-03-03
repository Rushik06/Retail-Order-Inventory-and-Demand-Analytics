import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
    reserveStockController,
    releaseStockController,
} from "../controllers/inventory.reservation.controller.js";

import {
    addStockController,
    deductStockController,
} from "../controllers/inventory.movement.controller.js";

import {
    reserveStockSchema,
    releaseStockSchema,
} from "../validations/inventory.reservation.validation.js";

import {
    addStockSchema,
    deductStockSchema,
} from "../validations/inventory.movement.validation.js";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reservation
 *     description: Inventory reservation management
 *   - name: Movement
 *     description: Inventory stock movement management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     ReserveStock:
 *       type: object
 *       required:
 *         - productId
 *         - warehouseId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *         warehouseId:
 *           type: integer
 *         quantity:
 *           type: integer
 *
 *     ReleaseStock:
 *       type: object
 *       required:
 *         - productId
 *         - warehouseId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *         warehouseId:
 *           type: integer
 *         quantity:
 *           type: integer
 *
 *     AddStock:
 *       type: object
 *       required:
 *         - productId
 *         - warehouseId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *         warehouseId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         referenceId:
 *           type: integer
 *           nullable: true
 *
 *     DeductStock:
 *       type: object
 *       required:
 *         - productId
 *         - warehouseId
 *         - quantity
 *         - referenceId
 *       properties:
 *         productId:
 *           type: integer
 *         warehouseId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         referenceId:
 *           type: integer
 */

/* All inventory routes require authentication */
router.use(authenticate);

/**
 * @swagger
 * /reserve:
 *   post:
 *     summary: Reserve stock (Prevent overselling)
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReserveStock'
 *     responses:
 *       200:
 *         description: Stock reserved successfully
 *       400:
 *         description: Validation or business error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/reserve",
    authorizeRoles("ORDER_SERVICE", "ADMIN"), validate(reserveStockSchema), reserveStockController
);

/**
 * @swagger
 * /release:
 *   post:
 *     summary: Release reserved stock
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReleaseStock'
 *     responses:
 *       200:
 *         description: Stock released successfully
 *       400:
 *         description: Validation or business error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/release",
    authorizeRoles("ORDER_SERVICE", "ADMIN"), validate(releaseStockSchema), releaseStockController
);

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add stock (Inbound movement)
 *     tags: [Movement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddStock'
 *     responses:
 *       200:
 *         description: Stock added successfully
 *       400:
 *         description: Validation or business error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/add",
    authorizeRoles("ADMIN", "WAREHOUSE_MANAGER"), validate(addStockSchema), addStockController
);

/**
 * @swagger
 * /deduct:
 *   post:
 *     summary: Deduct stock (Outbound movement)
 *     tags: [Movement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeductStock'
 *     responses:
 *       200:
 *         description: Stock deducted successfully
 *       400:
 *         description: Validation or business error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/deduct",
    authorizeRoles("ADMIN", "ORDER_SERVICE"), validate(deductStockSchema), deductStockController
);

export default router;