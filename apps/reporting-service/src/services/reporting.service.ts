import { counterreportRepository } from "../repository/counter-report.repository.js";
import { chartreportRepository } from "../repository/chart-report.repository.js";
import { tablereportRepository } from "../repository/aggregate-tablereport.repository.js";

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
      counterreportRepository.getTotalProducts(),
      counterreportRepository.getTotalWarehouses(),
      counterreportRepository.getLowStockCount(),
      counterreportRepository.getTotalOrders(),
      counterreportRepository.getTotalRevenue(),

      /* CHARTS */
      chartreportRepository.getWarehouseStockChart(),
      chartreportRepository.getCategoryDistributionChart(),
      chartreportRepository.getOrdersByStatus(),
      chartreportRepository.getTopSellingProducts(),

      /* TABLES */
      tablereportRepository.getLowStockProducts(),
      tablereportRepository.getRecentInventoryActivity(),
      tablereportRepository.getRecentOrders()

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

      counterreportRepository.getTotalProducts(),
      counterreportRepository.getTotalWarehouses(),
      counterreportRepository.getLowStockCount(),
      counterreportRepository.getTotalOrders(),
      counterreportRepository.getTotalRevenue()

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

      chartreportRepository.getWarehouseStockChart(),
      chartreportRepository.getCategoryDistributionChart(),
      chartreportRepository.getOrdersByStatus(),
      chartreportRepository.getTopSellingProducts()

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

      tablereportRepository.getLowStockProducts(),
      tablereportRepository.getRecentInventoryActivity(),
      tablereportRepository.getRecentOrders()

    ]);

    return {
      lowStockProducts,
      recentActivity,
      recentOrders
    };

  }

}

export const reportService = new ReportService();