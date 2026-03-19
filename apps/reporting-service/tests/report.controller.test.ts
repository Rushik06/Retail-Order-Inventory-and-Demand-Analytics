import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

import { reportController } from "../src/controllers/reporting.controller.js";
import { reportService } from "../src/services/reporting.service.js";

/* MOCK SERVICE */

/*eslint-disable */
vi.mock("../src/services/reporting.service.js", () => ({
  reportService: {
    getDashboard: vi.fn(),
    getCounters: vi.fn(),
    getCharts: vi.fn(),
    getTables: vi.fn()
  }
}));

describe("ReportController", () => {

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {

    req = {};

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    next = vi.fn();

    vi.clearAllMocks();

  });

  /* DASHBOARD */

  it("should return dashboard data", async () => {

    const mockData = { counters: {}, charts: {}, tables: {} };

    (reportService.getDashboard as any).mockResolvedValue(mockData);

    await reportController.getDashboard(
      req as Request,
      res as Response,
      next
    );

    expect(reportService.getDashboard).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);

  });

  it("should call next on dashboard error", async () => {

    const error = new Error("Dashboard error");

    (reportService.getDashboard as any).mockRejectedValue(error);

    await reportController.getDashboard(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(error);

  });

  /* COUNTERS */

  it("should return counters", async () => {

    const mockCounters = { totalProducts: 10 };

    (reportService.getCounters as any).mockResolvedValue(mockCounters);

    await reportController.getCounters(
      req as Request,
      res as Response,
      next
    );

    expect(reportService.getCounters).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCounters);

  });

  it("should call next on counters error", async () => {

    const error = new Error("Counters error");

    (reportService.getCounters as any).mockRejectedValue(error);

    await reportController.getCounters(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(error);

  });

  /* CHARTS */

  it("should return charts", async () => {

    const mockCharts = { warehouseStock: [] };

    (reportService.getCharts as any).mockResolvedValue(mockCharts);

    await reportController.getCharts(
      req as Request,
      res as Response,
      next
    );

    expect(reportService.getCharts).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCharts);

  });

  it("should call next on charts error", async () => {

    const error = new Error("Charts error");

    (reportService.getCharts as any).mockRejectedValue(error);

    await reportController.getCharts(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(error);

  });

  /* TABLES */

  it("should return tables", async () => {

    const mockTables = { recentOrders: [] };

    (reportService.getTables as any).mockResolvedValue(mockTables);

    await reportController.getTables(
      req as Request,
      res as Response,
      next
    );

    expect(reportService.getTables).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTables);

  });

  it("should call next on tables error", async () => {

    const error = new Error("Tables error");

    (reportService.getTables as any).mockRejectedValue(error);

    await reportController.getTables(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(error);

  });

});