import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {
    createWarehouseController,
    getAllWarehousesController,
    getWarehouseByIdController,
    updateWarehouseController,
    deactivateWarehouseController,
} from "../controllers/warehouse.controller.js";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: Warehouse
 *     description: Warehouse management APIs
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
 *     Warehouse:
 *       type: object
 *       properties:
 *         warehouse_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         is_active:
 *           type: boolean
 *
 *     CreateWarehouse:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         name:
 *           type: string
 *         location:
 *           type: string
 *
 *     UpdateWarehouse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         location:
 *           type: string
 */

/* All routes require authentication */
router.use(authenticate);

/**
 * @swagger
 * /warehouses:
 *   post:
 *     summary: Create new warehouse
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWarehouse'
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", authorizeRoles("ADMIN"), createWarehouseController);

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of warehouses
 *       401:
 *         description: Unauthorized
 */
router.get("/", authorizeRoles("ADMIN", "MANAGER", "STAFF"), getAllWarehousesController);

/**
 * @swagger
 * /warehouses/{warehouseId}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Warehouse details
 *       404:
 *         description: Warehouse not found
 */
router.get("/:id", authorizeRoles("ADMIN", "MANAGER", "STAFF"), getWarehouseByIdController);

/**
 * @swagger
 * /warehouses/{warehouseId}:
 *   patch:
 *     summary: Update warehouse
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWarehouse'
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *       404:
 *         description: Warehouse not found
 */
router.patch("/:id", authorizeRoles("ADMIN", "MANAGER"), updateWarehouseController);

/**
 * @swagger
 * /warehouses/{warehouseId}/deactivate:
 *   patch:
 *     summary: Deactivate warehouse
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Warehouse deactivated
 *       404:
 *         description: Warehouse not found
 */
router.patch("/:id/deactivate", authorizeRoles("ADMIN"), deactivateWarehouseController);

export default router;