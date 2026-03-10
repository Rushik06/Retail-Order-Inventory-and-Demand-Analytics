import { reportRepository } from "../repository/report.repository.js";

class ReportService {

  /* DASHBOARD DATA */

  async getDashboard() {

    const [
      totalProducts,
      totalWarehouses,
      lowStockCount,
      totalOrders,
      totalRevenue,

      warehouseStock,
      categoryDistribution,
      ordersByStatus,
      topSellingProducts,

      lowStockProducts,
      recentActivity,
      recentOrders

    ] = await Promise.all([

     /* COUNTERS */
      reportRepository.getTotalProducts(),
      reportRepository.getTotalWarehouses(),
      reportRepository.getLowStockCount(),
      reportRepository.getTotalOrders(),
      reportRepository.getTotalRevenue(),

      /* CHARTS */
      reportRepository.getWarehouseStockChart(),
      reportRepository.getCategoryDistributionChart(),
      reportRepository.getOrdersByStatus(),
      reportRepository.getTopSellingProducts(),

      /* TABLES */
      reportRepository.getLowStockProducts(),
      reportRepository.getRecentInventoryActivity(),
      reportRepository.getRecentOrders()

    ]);

    return {

      counters: {
        totalProducts,
        totalWarehouses,
        lowStockItems: lowStockCount,
        totalOrders,
        totalRevenue
      },

      charts: {
        warehouseStock,
        categoryDistribution,
        ordersByStatus,
        topSellingProducts
      },

      tables: {
        lowStockProducts,
        recentActivity,
        recentOrders
      }

    };
  }

  /* COUNTERS ONLY */

  async getCounters() {

    const [
      totalProducts,
      totalWarehouses,
      lowStockCount,
      totalOrders,
      totalRevenue
    ] = await Promise.all([

      reportRepository.getTotalProducts(),
      reportRepository.getTotalWarehouses(),
      reportRepository.getLowStockCount(),
      reportRepository.getTotalOrders(),
      reportRepository.getTotalRevenue()

    ]);

    return {
      totalProducts,
      totalWarehouses,
      lowStockItems: lowStockCount,
      totalOrders,
      totalRevenue
    };

  }

  /* CHARTS */

  async getCharts() {

    const [
      warehouseStock,
      categoryDistribution,
      ordersByStatus,
      topSellingProducts
    ] = await Promise.all([

      reportRepository.getWarehouseStockChart(),
      reportRepository.getCategoryDistributionChart(),
      reportRepository.getOrdersByStatus(),
      reportRepository.getTopSellingProducts()

    ]);

    return {
      warehouseStock,
      categoryDistribution,
      ordersByStatus,
      topSellingProducts
    };

  }

  /* TABLES */

  async getTables() {

    const [
      lowStockProducts,
      recentActivity,
      recentOrders
    ] = await Promise.all([

      reportRepository.getLowStockProducts(),
      reportRepository.getRecentInventoryActivity(),
      reportRepository.getRecentOrders()

    ]);

    return {
      lowStockProducts,
      recentActivity,
      recentOrders
    };

  }

}

export const reportService = new ReportService();