import { StockAlert } from "../models/stockalert.model.js";
import { findInventory } from "../repository/inventory.repository.js";
import type { Transaction } from "sequelize";

class InventoryAlertService {

  async checkLowStock(
    productId: number,
    warehouseId: number,
    threshold: number,
    transaction: Transaction
  ): Promise<void> {

    const inventory = await findInventory(
      productId,
      warehouseId,
      transaction
    );

    if (!inventory) return;

    const currentQty = inventory.getDataValue("available_qty");

    if (currentQty <= threshold) {
      await StockAlert.create({
        product_id: productId,
        warehouse_id: warehouseId,
        alert_type: "LOW_STOCK",
        threshold_qty: threshold,
        current_qty: currentQty,
      }, { transaction });
    }
  }
}

export const inventoryAlertService =
  new InventoryAlertService();