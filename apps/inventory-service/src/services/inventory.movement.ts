import { sequelize } from "../config/index.js";
import type { Transaction } from "sequelize";
import { InventoryLog } from "../models/inventorylog.model.js";
import { findInventory, saveInventory } from "../repository/inventory.repository.js";

class InventoryMovementService {

  async addStock(
    productId: number,
    warehouseId: number,
    quantity: number,
    referenceId?: number
  ): Promise<void> {

    await sequelize.transaction(async (transaction: Transaction) => {

      const inventory = await findInventory(
        productId,
        warehouseId,
        transaction,
        true
      );

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      const previous = inventory.getDataValue("available_qty");

      inventory.set("available_qty", previous + quantity);

      await saveInventory(inventory, transaction);

      await InventoryLog.create({
        product_id: productId,
        warehouse_id: warehouseId,
        action_type: "INBOUND",
        previous_available_qty: previous,
        new_available_qty: previous + quantity,
        reference_id: referenceId ?? null,
      }, { transaction });

    });
  }

  async deductStock(
    productId: number,
    warehouseId: number,
    quantity: number,
    referenceId: number
  ): Promise<void> {

    await sequelize.transaction(async (transaction: Transaction) => {

      const inventory = await findInventory(
        productId,
        warehouseId,
        transaction,
        true
      );

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      const previous = inventory.getDataValue("available_qty");

      if (previous < quantity) {
        throw new Error("Insufficient stock");
      }

      inventory.set("available_qty", previous - quantity);

      await saveInventory(inventory, transaction);

      await InventoryLog.create({
        product_id: productId,
        warehouse_id: warehouseId,
        action_type: "OUTBOUND",
        previous_available_qty: previous,
        new_available_qty: previous - quantity,
        reference_id: referenceId,
      }, { transaction });

    });
  }
}

export const inventoryMovementService =
  new InventoryMovementService();