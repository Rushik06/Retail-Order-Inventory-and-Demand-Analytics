/*DASHBOARD-HEADER TYPE */
export type User = {
  email: string;
  role: string;
};

/*DASHBOARD-CHART TYPES*/
 type WarehouseStock = {
  warehouse: string;
  total_stock: number;
};

 type TopSellingProduct = {
  product: string;
  total_sold: number;
};

 type CategoryDistribution = {
  category: string;
  total_products: number;
};

type OrderStatus = {
  status: string;
  count: number;
};

 type ChartsData = {
  warehouseStock: WarehouseStock[];
  topSellingProducts: TopSellingProduct[];
  categoryDistribution: CategoryDistribution[];
  ordersByStatus: OrderStatus[];
};

export type Props = {
  charts: ChartsData;
};
