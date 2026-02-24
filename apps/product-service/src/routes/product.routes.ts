import { Router } from "express";
import * as controller from "../controllers/product.controller.js";
import { authorize } from "../middleware/authorize.js";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Catalog Management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: iPhone 15
 *         sku:
 *           type: string
 *           example: IP15-128GB-BLK
 *         category:
 *           type: string
 *           example: Electronics
 *         price:
 *           type: number
 *           example: 79999
 *         stock:
 *           type: integer
 *           example: 50
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Only ADMIN and MANAGER can create products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: iPhone 15
 *             sku: IP15-128GB-BLK
 *             category: Electronics
 *             price: 79999
 *             stock: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized
 */
router.post("/", authorize("ADMIN", "MANAGER"), controller.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: ADMIN, MANAGER, and STAFF can view products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       403:
 *         description: Unauthorized
 */
router.get("/", authorize("ADMIN", "MANAGER", "STAFF"), controller.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Only ADMIN and MANAGER can update products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             price: 74999
 *             stock: 40
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Unauthorized
 */
router.patch("/:id", authorize("ADMIN", "MANAGER"), controller.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Only ADMIN can delete products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Unauthorized
 */
router.delete("/:id", authorize("ADMIN"), controller.deleteProduct);

export default router;