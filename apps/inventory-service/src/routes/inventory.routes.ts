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
    getAllInventoryController,
    getInventoryController
} from "../controllers/inventory.query.controller.js";

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
 *   - name: Inventory
 *     description: Inventory query APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/* All inventory routes require authentication */
router.use(authenticate);


/* INVENTORY QUERY ROUTES */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory records
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inventory records
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    authorizeRoles("ADMIN", "MANAGER","STAFF"),
    getAllInventoryController
);

/**
 * @swagger
 * /api/inventory/{productId}/{warehouseId}:
 *   get:
 *     summary: Get inventory for specific product and warehouse
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inventory record
 *       404:
 *         description: Inventory not found
 */
router.get(
    "/:id/:id",
    authorizeRoles("ADMIN", "MANAGER","STAFF"),
    getInventoryController
);

/* RESERVATION ROUTES */

/**
 * @swagger
 * /api/inventory/reserve:
 *   post:
 *     summary: Reserve stock (Prevent overselling)
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/reserve",
    authorizeRoles("MANAGER", "ADMIN"),
    validate(reserveStockSchema),
    reserveStockController
);

/**
 * @swagger
 * /api/inventory/release:
 *   post:
 *     summary: Release reserved stock
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/release",
    authorizeRoles("MANAGER", "ADMIN"),
    validate(releaseStockSchema),
    releaseStockController
);


/* MOVEMENT ROUTES */


/**
 * @swagger
 * /api/inventory/add:
 *   post:
 *     summary: Add stock (Inbound movement)
 *     tags: [Movement]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/add",
    authorizeRoles("ADMIN", "MANAGER"),
    validate(addStockSchema),
    addStockController
);

/**
 * @swagger
 * /api/inventory/deduct:
 *   post:
 *     summary: Deduct stock (Outbound movement)
 *     tags: [Movement]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/deduct",
    authorizeRoles("ADMIN", "MANAGER"),
    validate(deductStockSchema),
    deductStockController
);

export default router;