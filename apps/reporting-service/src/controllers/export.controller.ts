import type { Request, Response } from "express";
import { exportService } from "../services/export.service.js";

class ExportController {

  /* EXPORT PDF */
  async exportPDF(_req: Request, res: Response): Promise<void> {
    const file = await exportService.exportPDF();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=dashboard-report.pdf");
    res.send(file);
  }

  /* EXPORT EXCEL */
  async exportExcel(_req: Request, res: Response): Promise<void> {
    const file = await exportService.exportExcel();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=dashboard-report.xlsx");
    res.send(file);
  }

  /* EXPORT REPORT VIA EMAIL */
  async exportEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    await exportService.exportEmail(email);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  }

}

export const exportController = new ExportController();