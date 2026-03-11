import type { Request, Response, NextFunction } from "express";
import { exportService } from "../services/export.service.js";

class ExportController {

  /* EXPORT PDF */

  async exportPDF(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {

      const file = await exportService.exportPDF();

      res.setHeader("Content-Type", "application/pdf");

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=dashboard-report.pdf"
      );

      res.send(file);

    } catch (error) {
      next(error);
    }

  }

  /* EXPORT EXCEL */

  async exportExcel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {

      const file = await exportService.exportExcel();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=dashboard-report.xlsx"
      );

      res.send(file);

    } catch (error) {
      next(error);
    }

  }

  /* EXPORT REPORT VIA EMAIL */

  async exportEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {

      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          message: "Email is required"
        });
        return;
      }

      const result = await exportService.exportEmail(email);

      res.status(200).json(result);

    } catch (error) {
      next(error);
    }

  }

}

export const exportController = new ExportController();