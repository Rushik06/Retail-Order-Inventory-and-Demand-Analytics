import { sequelize } from "../config/sequilize.js";

class ReportRepository{
  

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

 export const tablereportRepository = new ReportRepository();