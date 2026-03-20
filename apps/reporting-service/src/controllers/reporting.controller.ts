import type { Request, Response } from "express";
import { reportService } from "../services/reporting.service.js";

class ReportController {

  /* FULL DASHBOARD */
  async getDashboard(_req: Request, res: Response): Promise<void> {
    const data = await reportService.getDashboard();
    res.status(200).json(data);
  }

  /* COUNTERS */
  async getCounters(_req: Request, res: Response): Promise<void> {
    const counters = await reportService.getCounters();
    res.status(200).json(counters);
  }

  /* CHARTS */
  async getCharts(_req: Request, res: Response): Promise<void> {
    const charts = await reportService.getCharts();
    res.status(200).json(charts);
  }

  /* TABLES */
  async getTables(_req: Request, res: Response): Promise<void> {
    const tables = await reportService.getTables();
    res.status(200).json(tables);
  }

}

export const reportController = new ReportController();