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
    createInventoryController
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
 *   - name: Inventory
 *     description: Inventory query APIs
 *   - name: Movement
 *     description: Inventory stock movement management
 *   - name: Reservation
 *     description: Inventory reservation management
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

/* All routes require authentication */
router.use(authenticate);



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
 *     summary: Get inventory for a specific product in a warehouse
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory record found
 *       404:
 *         description: Inventory not found
 */
router.get(
    "/:productId/:warehouseId",
    authorizeRoles("ADMIN", "MANAGER","STAFF"),
    getInventoryController
);



/**
 * @swagger
 * /api/inventory/create:
 *   post:
 *     summary: Create inventory record manually
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: "product-uuid"
 *             warehouseId: "warehouse-uuid"
 *             availableQty: 100
 *             reservedQty: 0
 *     responses:
 *       201:
 *         description: Inventory created successfully
 */
router.post(
    "/create",
    authorizeRoles("ADMIN", "MANAGER"),
    createInventoryController
);



/**
 * @swagger
 * /api/inventory/reserve:
 *   post:
 *     summary: Reserve stock to prevent overselling
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: "product-uuid"
 *             warehouseId: "warehouse-uuid"
 *             quantity: 5
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: "product-uuid"
 *             warehouseId: "warehouse-uuid"
 *             quantity: 5
 */
router.post(
    "/release",
    authorizeRoles("MANAGER", "ADMIN"),
    validate(releaseStockSchema),
    releaseStockController
);



/**
 * @swagger
 * /api/inventory/add:
 *   post:
 *     summary: Add stock (Inbound movement)
 *     tags: [Movement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: "product-uuid"
 *             warehouseId: "warehouse-uuid"
 *             quantity: 20
 *             referenceId: "PO-12345"
 *     responses:
 *       200:
 *         description: Stock added successfully
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             productId: "product-uuid"
 *             warehouseId: "warehouse-uuid"
 *             quantity: 10
 *             referenceId: "ORDER-001"
 *     responses:
 *       200:
 *         description: Stock deducted successfully
 */
router.post(
    "/deduct",
    authorizeRoles("ADMIN", "MANAGER"),
    validate(deductStockSchema),
    deductStockController
);

export default router;