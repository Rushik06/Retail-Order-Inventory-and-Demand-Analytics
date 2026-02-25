import { Router } from "express";
import * as controller from "../controllers/order.controller.js";
import { authorize } from "../middleware/authorize.js";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order lifecycle management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: "uuid-product-id"
 *         quantity:
 *           type: number
 *           example: 2
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - customerName
 *         - items
 *       properties:
 *         customerName:
 *           type: string
 *           example: "John Doe"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *
 *     UpdateOrderStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [CREATED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *           example: SHIPPED
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authorize("ADMIN", "MANAGER", "STAFF"),
  controller.createOrder
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/status",
  authorize("ADMIN", "MANAGER"),
  controller.updateOrderStatus
);

export default router;