export interface DashboardData {
  counters: {
    totalProducts: number;
    totalWarehouses: number;
    lowStockItems: number;
    totalOrders: number;
    totalRevenue: number;
  };
  charts: unknown;
  tables: unknown;
}