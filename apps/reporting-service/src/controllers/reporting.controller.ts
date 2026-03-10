import type { Request, Response, NextFunction } from "express";
import { reportService } from "../services/reporting.service.js";

class ReportController {

  /* FULL DASHBOARD */

  async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {

      const data = await reportService.getDashboard();

      res.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  /* COUNTERS */

  async getCounters(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {

      const counters = await reportService.getCounters();

      res.status(200).json(counters);

    } catch (error) {
      next(error);
    }

  }

  /* CHARTS */

  async getCharts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {

      const charts = await reportService.getCharts();

      res.status(200).json(charts);

    } catch (error) {
      next(error);
    }

  }

  /* TABLES */

  async getTables(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    try {

      const tables = await reportService.getTables();

      res.status(200).json(tables);

    } catch (error) {
      next(error);
    }

  }

}

export const reportController = new ReportController();