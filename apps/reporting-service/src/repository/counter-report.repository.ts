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
    SELECT SUM(p.price * oi.quantity) as revenue
    FROM order_items oi
    JOIN products p
      ON p.id = oi.product_id
  `);

    return Number(rows[0].revenue || 0);

  }


}
export const counterreportRepository = new ReportRepository();