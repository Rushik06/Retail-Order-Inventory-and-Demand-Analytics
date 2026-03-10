import { Router } from "express";
import { exportController } from "../controllers/export.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Report Export
 *   description: Export dashboard analytics reports
 */

/**
 * @swagger
 * /reports/export/pdf:
 *   get:
 *     summary: Export dashboard report as PDF
 *     tags: [Report Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF report generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/export/pdf",
  authenticate,
  authorizeRoles("manager", "admin", "super_admin"),
  exportController.exportPDF.bind(exportController)
);

/**
 * @swagger
 * /reports/export/excel:
 *   get:
 *     summary: Export dashboard report as Excel
 *     tags: [Report Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel report generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/export/excel",
  authenticate,
  authorizeRoles("manager", "admin", "super_admin"),
  exportController.exportExcel.bind(exportController)
);

export default router;