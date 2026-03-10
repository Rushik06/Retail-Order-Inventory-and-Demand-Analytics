import { Router } from "express";
import { reportController } from "../controllers/reporting.controller.js";

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
  reportController.getTables.bind(reportController)
);

export default router;