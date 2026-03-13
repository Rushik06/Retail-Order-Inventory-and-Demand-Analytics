import ExcelJS from "exceljs";
import type { DashboardData } from "../types/generator.types.js";

export const generateDashboardExcel = async (
  data: DashboardData
): Promise<Buffer> => {

  const workbook = new ExcelJS.Workbook();

  /*  COUNTERS  */

  const countersSheet = workbook.addWorksheet("Summary");

  countersSheet.columns = [
    { header: "Metric", key: "metric", width: 30 },
    { header: "Value", key: "value", width: 20 }
  ];

  countersSheet.addRow({
    metric: "Total Products",
    value: data.counters.totalProducts
  });

  countersSheet.addRow({
    metric: "Total Warehouses",
    value: data.counters.totalWarehouses
  });

  countersSheet.addRow({
    metric: "Low Stock Items",
    value: data.counters.lowStockItems
  });

  countersSheet.addRow({
    metric: "Total Orders",
    value: data.counters.totalOrders
  });

  countersSheet.addRow({
    metric: "Total Revenue",
    value: data.counters.totalRevenue
  });


  /*  WAREHOUSE STOCK*/

  const warehouseSheet = workbook.addWorksheet("Warehouse Stock");

  warehouseSheet.columns = [
    { header: "Warehouse", key: "warehouse", width: 30 },
    { header: "Total Stock", key: "total_stock", width: 20 }
  ];

  data.charts.warehouseStock.forEach((w) => {
    warehouseSheet.addRow({
      warehouse: w.warehouse,
      total_stock: w.total_stock
    });
  });


  /*  TOP SELLING PRODUCTS  */

  const topProductsSheet = workbook.addWorksheet("Top Products");

  topProductsSheet.columns = [
    { header: "Product", key: "product", width: 30 },
    { header: "Total Sold", key: "total_sold", width: 20 }
  ];

  data.charts.topSellingProducts.forEach((p) => {
    topProductsSheet.addRow({
      product: p.product,
      total_sold: p.total_sold
    });
  });


  /* CATEGORY DISTRIBUTION */

  const categorySheet = workbook.addWorksheet("Category Distribution");

  categorySheet.columns = [
    { header: "Category", key: "category", width: 30 },
    { header: "Total Products", key: "total_products", width: 20 }
  ];

  data.charts.categoryDistribution.forEach((c) => {
    categorySheet.addRow({
      category: c.category,
      total_products: c.total_products
    });
  });


  /* ORDER STATUS  */

  const statusSheet = workbook.addWorksheet("Orders By Status");

  statusSheet.columns = [
    { header: "Status", key: "status", width: 25 },
    { header: "Count", key: "count", width: 15 }
  ];

  data.charts.ordersByStatus.forEach((o) => {
    statusSheet.addRow({
      status: o.status,
      count: o.count
    });
  });


  /* RECENT ORDERS */

  const ordersSheet = workbook.addWorksheet("Recent Orders");

  ordersSheet.columns = [
    { header: "Customer", key: "customer", width: 30 },
    { header: "Product", key: "product", width: 30 },
    { header: "Status", key: "status", width: 20 },
    { header: "Order Date", key: "date", width: 25 }
  ];

  data.tables.recentOrders.forEach((order) => {
    ordersSheet.addRow({
      customer: order.customer_name,
      product: order.product_name,
      status: order.status,
      date: order.order_date
    });
  });


  /*  INVENTORY ACTIVIY */

  const activitySheet = workbook.addWorksheet("Inventory Activity");

  activitySheet.columns = [
    { header: "Product", key: "product", width: 30 },
    { header: "Warehouse", key: "warehouse", width: 30 },
    { header: "Action", key: "action", width: 20 },
    { header: "Quantity", key: "qty", width: 15 }
  ];

  data.tables.recentActivity.forEach((a) => {
    activitySheet.addRow({
      product: a.product_name,
      warehouse: a.warehouse_name,
      action: a.action_type,
      qty: a.new_available_qty
    });
  });


  /* EXPORT BUFFER */

  const buffer = await workbook.xlsx.writeBuffer();

  return Buffer.from(buffer);

};