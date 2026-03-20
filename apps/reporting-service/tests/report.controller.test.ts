/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import { reportController } from "../src/controllers/reporting.controller.js";
import { reportService } from "../src/services/reporting.service.js";

/* MOCKS */

vi.mock("../src/services/reporting.service.js", () => ({
  reportService: {
    getDashboard: vi.fn(),
    getCounters: vi.fn(),
    getCharts: vi.fn(),
    getTables: vi.fn()
  }
}));

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("ReportController", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* DASHBOARD */

  describe("getDashboard", () => {

    it("should return 200 with dashboard data", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockData = {
        counters: { totalProducts: 10, totalOrders: 20 },
        charts: {},
        tables: {}
      };

      (reportService.getDashboard as any).mockResolvedValue(mockData);

      await reportController.getDashboard(req, res);

      expect(reportService.getDashboard).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);

    });

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (reportService.getDashboard as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(reportController.getDashboard(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

  /* COUNTERS */

  describe("getCounters", () => {

    it("should return 200 with counters data", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockCounters = {
        totalProducts: 10,
        totalWarehouses: 5,
        lowStockItems: 2,
        totalOrders: 20,
        totalRevenue: 1000
      };

      (reportService.getCounters as any).mockResolvedValue(mockCounters);

      await reportController.getCounters(req, res);

      expect(reportService.getCounters).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCounters);

    });

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (reportService.getCounters as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(reportController.getCounters(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

  /* CHARTS */

  describe("getCharts", () => {

    it("should return 200 with charts data", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockCharts = {
        warehouseStock: [{ warehouse: "A", total_stock: 100 }],
        categoryDistribution: [],
        ordersByStatus: [],
        topSellingProducts: []
      };

      (reportService.getCharts as any).mockResolvedValue(mockCharts);

      await reportController.getCharts(req, res);

      expect(reportService.getCharts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCharts);

    });

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (reportService.getCharts as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(reportController.getCharts(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

  /* TABLES */

  describe("getTables", () => {

    it("should return 200 with tables data", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockTables = {
        recentActivity: [{ product_name: "Laptop" }],
        recentOrders: [{ customer_name: "John" }]
      };

      (reportService.getTables as any).mockResolvedValue(mockTables);

      await reportController.getTables(req, res);

      expect(reportService.getTables).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTables);

    });

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (reportService.getTables as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(reportController.getTables(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

});