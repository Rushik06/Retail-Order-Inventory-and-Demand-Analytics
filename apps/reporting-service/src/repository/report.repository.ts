/*eslint-disable*/
import { sequelize } from "../config/sequilize.js";
class ReportRepository {

  /* COUNTERS */

  async getTotalProducts(): Promise<number> {

    const [rows]: any = await sequelize.query(
      `SELECT COUNT(*) as count FROM products`
    );
    return Number(rows[0].count);

  }

  async getTotalWarehouses(): Promise<number> {

    const [rows]: any = await sequelize.query(
      `SELECT COUNT(*) as count FROM warehouses`
    );
    return Number(rows[0].count);

  }

  async getTotalOrders(): Promise<number> {

    const [rows]: any = await sequelize.query(
      `SELECT COUNT(*) as count FROM orders`
    );
    return Number(rows[0].count);

  }

  async getLowStockCount(): Promise<number> {

    const [rows]: any = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM stock_alerts
      WHERE is_resolved = false
    `);

    return Number(rows[0].count);

  }

  async getTotalRevenue(): Promise<number> {

    const [rows]: any = await sequelize.query(`
      SELECT SUM(price * quantity) as revenue
      FROM order_items
    `);

    return Number(rows[0].revenue || 0);

  }

  /* BAR CHART — WAREHOUSE STOCK */

  async getWarehouseStockChart() {

    const [rows] = await sequelize.query(`
      SELECT
        w.name as warehouse,
        SUM(i.available_qty) as total_stock
      FROM inventory i
      JOIN warehouses w
        ON w.id = i.warehouse_id
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

  /* TABLE — LOW STOCK PRODUCTS */

  async getLowStockProducts() {

    const [rows] = await sequelize.query(`
      SELECT
        p.name as product,
        w.name as warehouse,
        i.available_qty
      FROM inventory i
      JOIN products p
        ON p.id = i.product_id
      JOIN warehouses w
        ON w.id = i.warehouse_id
      WHERE i.available_qty < 10
      ORDER BY i.available_qty ASC
    `);
    return rows;

  }

  /* TABLE — RECENT INVENTORY ACTIVITY */

  async getRecentInventoryActivity() {

    const [rows] = await sequelize.query(`
      SELECT
        product_id,
        warehouse_id,
        action_type,
        new_available_qty,
        created_at
      FROM inventory_logs
      ORDER BY created_at DESC
      LIMIT 10
    `);
    return rows;

  }

  /* TABLE — RECENT ORDERS */

  async getRecentOrders() {

    const [rows] = await sequelize.query(`
      SELECT
        id,
        status,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `);
    return rows;

  }

}
export const reportRepository = new ReportRepository();