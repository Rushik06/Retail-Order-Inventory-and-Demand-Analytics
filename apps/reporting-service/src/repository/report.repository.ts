import { Sequelize } from "sequelize";
import { ProductSummary } from "../models/product-summary.model.js";
import { WarehouseSummary } from "../models/warehouse-summary.model.js";
import { InventorySummary } from "../models/inventory-summary.model.js";
import { InventoryActivity } from "../models/inventory-activity.model.js";
import { OrderSummary } from "../models/order-summary.model.js";
class ReportRepository {

    /* COUNTERS */
    async getTotalProducts(): Promise<number> {
        return await ProductSummary.count();

    }

    async getTotalWarehouses(): Promise<number> {
        return await WarehouseSummary.count();

    }
    async getTotalOrders(): Promise<number> {
        return await OrderSummary.count();
    }

    async getLowStockCount(): Promise<number> {
        return await InventorySummary.count({
            where: {
                status: "LOW"
            }
        });

    }
    async getTotalRevenue() {
        const result = await OrderSummary.findAll({
            attributes: [
                [Sequelize.fn("SUM", Sequelize.col("total_amount")), "total"]
            ]
        });

        return result[0]?.get("total") || 0;

    }

    /* BAR CHART */

    async getWarehouseStockChart() {
        return await InventorySummary.findAll({

            attributes: [
                "warehouse_id",
                [Sequelize.fn("SUM", Sequelize.col("available_qty")), "total_stock"]
            ],

            group: ["warehouse_id"]

        });

    }
    async getTopSellingProducts() {

        return await OrderSummary.findAll({

            attributes: [
                "product_id",
                [Sequelize.fn("SUM", Sequelize.col("quantity")), "total_sold"]
            ],

            group: ["product_id"],
            order: [[Sequelize.literal("total_sold"), "DESC"]],
            limit: 5

        });

    }

    /* PIE CHART  */

    async getCategoryDistributionChart() {

        return await ProductSummary.findAll({

            attributes: [
                "category",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "total_products"]
            ],

            group: ["category"]

        });

    }
    async getOrdersByStatus() {

        return await OrderSummary.findAll({

            attributes: [
                "status",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
            ],

            group: ["status"]

        });

    }

    /* TABLE FOR LOW STOCK PRODUCTS */

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

    /* TABLE FOR RECENT INVENTORY ACTIVITY */

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

     /* TABLE FOR RECENT ORDERS */
    async getRecentOrders() {

        return await OrderSummary.findAll({

            attributes: [
                "id",
                "product_id",
                "quantity",
                "total_amount",
                "status",
                "created_at"
            ],

            order: [["created_at", "DESC"]], limit: 10

        });
    }
}

export const reportRepository = new ReportRepository();