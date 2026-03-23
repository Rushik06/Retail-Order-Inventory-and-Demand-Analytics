import { Router } from "express";
import { reportController } from "../controllers/reporting.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router : Router = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting and analytics endpoints
 */

/**
 * @swagger
 * /reports/dashboard:
 *   get:
 *     summary: Get complete dashboard data
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 counters:
 *                   type: object
 *                 charts:
 *                   type: object
 *                 tables:
 *                   type: object
 */
router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("manager" ,"staff","admin" ,"super-admin"),
  reportController.getDashboard.bind(reportController)
);

/**
 * @swagger
 * /reports/counters:
 *   get:
 *     summary: Get dashboard counters
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Counters retrieved successfully
 */
router.get(
  "/counters",
  authenticate,
  authorizeRoles("manager" ,"staff","admin" ,"super-admin"),
  reportController.getCounters.bind(reportController)
);

/**
 * @swagger
 * /reports/charts:
 *   get:
 *     summary: Get dashboard charts
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Charts retrieved successfully
 */
router.get(
  "/charts",
  authenticate,
  authorizeRoles("manager" ,"staff","admin" ,"super-admin"),
  reportController.getCharts.bind(reportController)
);

/**
 * @swagger
 * /reports/tables:
 *   get:
 *     summary: Get dashboard tables
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Tables retrieved successfully
 */
router.get(
  "/tables",
  authenticate,
  authorizeRoles("manager" ,"staff","admin" ,"super-admin"),
  reportController.getTables.bind(reportController)
);

export default router;