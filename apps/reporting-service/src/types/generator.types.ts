export interface WarehouseStock {
  warehouse: string;
  total_stock: number;
}

export interface TopSellingProduct {
  product: string;
  total_sold: number;
}

export interface CategoryDistribution {
  category: string;
  total_products: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface InventoryActivity {
  product_name: string;
  warehouse_name: string;
  action_type: string;
  new_available_qty: number;
}

export interface RecentOrder {
  customer_name: string;
  product_name: string;
  status: string;
  order_date: string;
}

export interface DashboardData {
  counters: {
    totalProducts: number;
    totalWarehouses: number;
    lowStockItems: number;
    totalOrders: number;
    totalRevenue: number;
  };

  charts: {
    warehouseStock: WarehouseStock[];
    topSellingProducts: TopSellingProduct[];
    categoryDistribution: CategoryDistribution[];
    ordersByStatus: OrdersByStatus[];
  };

  tables: {
    recentActivity: InventoryActivity[];
    recentOrders: RecentOrder[];
  };
}