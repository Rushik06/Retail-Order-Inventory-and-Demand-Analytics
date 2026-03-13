import { Router } from "express";
import { exportController } from "../controllers/export.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { validate } from "../middleware/validate-schema.js";
import { exportEmailSchema } from "../validations/export.schema.js";

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
  "/pdf",
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
  "/excel",
  authenticate,
  authorizeRoles("manager", "admin", "super_admin"),
  exportController.exportExcel.bind(exportController)
);
/**
 * @swagger
 * /reports/export/email:
 *   get:
 *     summary: Export dashboard report in Email
 *     tags: [Report Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                  -email
 *                properties:
 *                   email:
 *                     type: string
 *                     example:your@gmail.com             
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.post("/email",
  authenticate,
  authorizeRoles("manager", "admin", "super_admin"),
  validate(exportEmailSchema),
  exportController.exportEmail.bind(exportController));


export default router;