import { reportRepository } from "../repository/report.repository.js";

class ReportService {

  /* DASHBOARD DATA */

  async getDashboard() {

    const [
      totalProducts,
      totalWarehouses,
      lowStockCount,
      warehouseStock,
      categoryDistribution,
      lowStockProducts,
      recentActivity
    ] = await Promise.all([

      reportRepository.getTotalProducts(),
      reportRepository.getTotalWarehouses(),
      reportRepository.getLowStockCount(),

      reportRepository.getWarehouseStockChart(),
      reportRepository.getCategoryDistributionChart(),

      reportRepository.getLowStockProducts(),
      reportRepository.getRecentInventoryActivity()

    ]);

    return {

      counters: {
        totalProducts,
        totalWarehouses,
        lowStockItems: lowStockCount
      },

      charts: {
        warehouseStock,
        categoryDistribution
      },

      tables: {
        lowStockProducts,
        recentActivity
      }

    };

  }

  /* COUNTERS ONLY */

  async getCounters() {

    const [
      totalProducts,
      totalWarehouses,
      lowStockCount
    ] = await Promise.all([

      reportRepository.getTotalProducts(),
      reportRepository.getTotalWarehouses(),
      reportRepository.getLowStockCount()

    ]);

    return {
      totalProducts,
      totalWarehouses,
      lowStockItems: lowStockCount
    };

  }

  /* CHARTS */

  async getCharts() {

    const [
      warehouseStock,
      categoryDistribution
    ] = await Promise.all([

      reportRepository.getWarehouseStockChart(),
      reportRepository.getCategoryDistributionChart()

    ]);

    return {
      warehouseStock,
      categoryDistribution
    };

  }

  /* TABLES */

  async getTables() {

    const [
      lowStockProducts,
      recentActivity
    ] = await Promise.all([

      reportRepository.getLowStockProducts(),
      reportRepository.getRecentInventoryActivity()

    ]);

    return {
      lowStockProducts,
      recentActivity
    };

  }

}

export const reportService = new ReportService();