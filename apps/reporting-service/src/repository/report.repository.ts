import { Sequelize } from "sequelize";
import { ProductSummary } from "../models/product-summary.model.js";
import { WarehouseSummary } from "../models/warehouse-summary.model.js";
import { InventorySummary } from "../models/inventory-summary.model.js";
import { InventoryActivity } from "../models/inventory-activity.model.js";

class ReportRepository {

  /* COUNTERS */

  async getTotalProducts(): Promise<number> {

    return await ProductSummary.count();

  }

  async getTotalWarehouses(): Promise<number> {

    return await WarehouseSummary.count();

  }

  async getLowStockCount(): Promise<number> {

    return await InventorySummary.count({
      where: {
        status: "LOW"
      }
    });

  }

  /* BAR CHART → WAREHOUSE STOCK DISTRIBUTION */

  async getWarehouseStockChart() {

    return await InventorySummary.findAll({

      attributes: [
        "warehouse_id",
        [Sequelize.fn("SUM", Sequelize.col("available_qty")), "total_stock"]
      ],

      group: ["warehouse_id"]

    });

  }

  /* PIE CHART → PRODUCT CATEGORY DISTRIBUTION */

  async getCategoryDistributionChart() {

    return await ProductSummary.findAll({

      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_products"]
      ],

      group: ["category"]

    });

  }

  /* TABLE → LOW STOCK PRODUCTS */

  async getLowStockProducts() {
    return await InventorySummary.findAll({

      where: {
        status: "LOW"
      },

      attributes: [
        "product_id",
        "warehouse_id",
        "available_qty",
        "threshold"
      ],

      order: [
        ["available_qty", "ASC"]
      ]

    });

  }

  /* TABLE → RECENT INVENTORY ACTIVITY */

  async getRecentInventoryActivity() {
    return await InventoryActivity.findAll({

      attributes: [
        "product_id",
        "warehouse_id",
        "action_type",
        "quantity",
        "created_at"
      ],

      order: [
        ["created_at", "DESC"]
      ],

      limit: 10

  });

  }
}

export const reportRepository = new ReportRepository();