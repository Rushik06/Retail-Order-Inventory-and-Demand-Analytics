import { StockAlert } from "../models/stockalert.model.js";
import { findInventory } from "../repository/inventory.repository.js";
import type { Transaction } from "sequelize";

class InventoryAlertService {

  async checkLowStock(
    productId: string,      
    warehouseId: string,    
    threshold: number,
    transaction: Transaction
  ): Promise<void> {

    const inventory = await findInventory(
      productId,
      warehouseId,
      transaction
    );

    if (!inventory) return;

    const available = inventory.getDataValue("available_qty");
    const reserved = inventory.getDataValue("reserved_qty");

    const effectiveQty = available - reserved;

    if (effectiveQty <= threshold) {

      const existingAlert = await StockAlert.findOne({
        where: {
          product_id: productId,
          warehouse_id: warehouseId,
          alert_type: "LOW_STOCK",
          is_resolved: false,
        },
        transaction,
      });

      if (!existingAlert) {
        await StockAlert.create({
          product_id: productId,
          warehouse_id: warehouseId,
          alert_type: "LOW_STOCK",
          threshold_qty: threshold,
          current_qty: effectiveQty,
        }, { transaction });
      }
    }
  }
}

export const inventoryAlertService =
  new InventoryAlertService();