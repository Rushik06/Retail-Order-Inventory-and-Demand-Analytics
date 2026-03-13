import { describe, it, expect, vi, beforeEach } from "vitest";

import { reportService } from "../src/services/reporting.service.js";

import { counterreportRepository } from "../src/repository/counter-report.repository.js";
import { chartreportRepository } from "../src/repository/chart-report.repository.js";
import { tablereportRepository } from "../src/repository/aggregate-tablereport.repository.js";

/* MOCK REPOSITORIES */

/*eslint-disable */
vi.mock("../repository/counter-report.repository.js", () => ({
  counterreportRepository: {
    getTotalProducts: vi.fn(),
    getTotalWarehouses: vi.fn(),
    getLowStockCount: vi.fn(),
    getTotalOrders: vi.fn(),
    getTotalRevenue: vi.fn()
  }
}));

vi.mock("../repository/chart-report.repository.js", () => ({
  chartreportRepository: {
    getWarehouseStockChart: vi.fn(),
    getCategoryDistributionChart: vi.fn(),
    getOrdersByStatus: vi.fn(),
    getTopSellingProducts: vi.fn()
  }
}));

vi.mock("../repository/aggregate-tablereport.repository.js", () => ({
  tablereportRepository: {
    getRecentInventoryActivity: vi.fn(),
    getRecentOrders: vi.fn()
  }
}));

describe("ReportService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* DASHBOARD */

  it("should return dashboard data", async () => {

    (counterreportRepository.getTotalProducts as any).mockResolvedValue(10);
    (counterreportRepository.getTotalWarehouses as any).mockResolvedValue(5);
    (counterreportRepository.getLowStockCount as any).mockResolvedValue(2);
    (counterreportRepository.getTotalOrders as any).mockResolvedValue(20);
    (counterreportRepository.getTotalRevenue as any).mockResolvedValue(1000);

    (chartreportRepository.getWarehouseStockChart as any).mockResolvedValue([]);
    (chartreportRepository.getCategoryDistributionChart as any).mockResolvedValue([]);
    (chartreportRepository.getOrdersByStatus as any).mockResolvedValue([]);
    (chartreportRepository.getTopSellingProducts as any).mockResolvedValue([]);

    (tablereportRepository.getRecentInventoryActivity as any).mockResolvedValue([]);
    (tablereportRepository.getRecentOrders as any).mockResolvedValue([]);

    const result = await reportService.getDashboard();

    expect(result).toEqual({

      counters: {
        totalProducts: 10,
        totalWarehouses: 5,
        lowStockItems: 2,
        totalOrders: 20,
        totalRevenue: 1000
      },

      charts: {
        warehouseStock: [],
        categoryDistribution: [],
        ordersByStatus: [],
        topSellingProducts: []
      },

      tables: {
        recentActivity: [],
        recentOrders: []
      }

    });

  });

  /* COUNTERS */

  it("should return counters only", async () => {

    (counterreportRepository.getTotalProducts as any).mockResolvedValue(10);
    (counterreportRepository.getTotalWarehouses as any).mockResolvedValue(5);
    (counterreportRepository.getLowStockCount as any).mockResolvedValue(2);
    (counterreportRepository.getTotalOrders as any).mockResolvedValue(20);
    (counterreportRepository.getTotalRevenue as any).mockResolvedValue(1000);

    const result = await reportService.getCounters();

    expect(result).toEqual({
      totalProducts: 10,
      totalWarehouses: 5,
      lowStockItems: 2,
      totalOrders: 20,
      totalRevenue: 1000
    });

  });

  /* CHARTS */

  it("should return chart data", async () => {

    (chartreportRepository.getWarehouseStockChart as any).mockResolvedValue([{ warehouse: "A", total_stock: 100 }]);

    (chartreportRepository.getCategoryDistributionChart as any).mockResolvedValue([{ category: "Electronics", total_products: 20 }]);

    (chartreportRepository.getOrdersByStatus as any).mockResolvedValue([{ status: "DELIVERED", count: 10 }]);

    (chartreportRepository.getTopSellingProducts as any).mockResolvedValue([{ product: "Laptop", total_sold: 5 }]);

    const result = await reportService.getCharts();

    expect(result).toEqual({
      warehouseStock: [{ warehouse: "A", total_stock: 100 }],
      categoryDistribution: [{ category: "Electronics", total_products: 20 }],
      ordersByStatus: [{ status: "DELIVERED", count: 10 }],
      topSellingProducts: [{ product: "Laptop", total_sold: 5 }]
    });

  });

  /* TABLES */

  it("should return table data", async () => {

    (tablereportRepository.getRecentInventoryActivity as any).mockResolvedValue([{ product_name: "Laptop" }]);

    (tablereportRepository.getRecentOrders as any).mockResolvedValue([{ customer_name: "John" }]);

    const result = await reportService.getTables();

    expect(result).toEqual({
      recentActivity: [{ product_name: "Laptop" }],
      recentOrders: [{ customer_name: "John" }]
    });

  });

});