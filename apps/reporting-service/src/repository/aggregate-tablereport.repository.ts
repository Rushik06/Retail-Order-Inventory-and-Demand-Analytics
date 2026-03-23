import { sequelize } from "../config/sequilize.js";

class ReportRepository {


  /* TABLE — RECENT INVENTORY ACTIVITY */

  async getRecentInventoryActivity() {

    const [rows] = await sequelize.query(`
      SELECT
        product_id,
        warehouse_id,
        action_type,
        new_available_qty,
        "createdAt"
      FROM inventory_logs
      ORDER BY "createdAt" DESC
      LIMIT 10
    `);
    return rows;

  }

  /* TABLE — RECENT ORDERS */

  async getRecentOrders() {

    const [rows] = await sequelize.query(`
      SELECT
        o.id,
        o.customer_name,
        o.status,
        p.name AS product_name,
        p.id AS product_id,
        o.created_at AS order_date
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      ORDER BY o.created_at DESC
      LIMIT 10
`);

    return rows;
  }

}

export const tablereportRepository = new ReportRepository();