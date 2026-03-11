import { sequelize } from "../config/sequilize.js";


 /* BAR CHART — WAREHOUSE STOCK */
 class ReportRepository{
  async getWarehouseStockChart() {

    const [rows] = await sequelize.query(`
      SELECT
        w.name as warehouse,
        SUM(i.available_qty) as total_stock
      FROM inventory i
      JOIN warehouses w
        ON w.warehouse_id = i.warehouse_id
      GROUP BY w.name
    `);

    return rows;

  }

  /* BAR CHART — TOP SELLING PRODUCTS */

  async getTopSellingProducts() {

    const [rows] = await sequelize.query(`
      SELECT
        p.name as product,
        SUM(oi.quantity) as total_sold
      FROM order_items oi
      JOIN products p
        ON p.id = oi.product_id
      GROUP BY p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    return rows;

  }

  /* PIE CHART — PRODUCT CATEGORY DISTRIBUTION */

  async getCategoryDistributionChart() {

    const [rows] = await sequelize.query(`
      SELECT
        category,
        COUNT(*) as total_products
      FROM products
      GROUP BY category
    `);
    return rows;

  }

  /* PIE CHART — ORDERS BY STATUS */

  async getOrdersByStatus() {

    const [rows] = await sequelize.query(`
      SELECT
        status,
        COUNT(*) as count
      FROM orders
      GROUP BY status
    `);
    return rows;

  }
 }
 export const chartreportRepository = new ReportRepository();