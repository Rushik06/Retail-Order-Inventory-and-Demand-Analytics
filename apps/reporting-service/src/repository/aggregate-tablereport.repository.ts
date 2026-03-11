import { sequelize } from "../config/sequilize.js";

class ReportRepository{
    
  /*TABLE-LOW STOCK PRODUCTS*/

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
        ON w.warehouse_id = i.warehouse_id
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