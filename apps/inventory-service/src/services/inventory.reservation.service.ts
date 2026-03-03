import { sequelize } from "../config/index.js";
import type { Transaction } from "sequelize";
import { findInventory, saveInventory } from "../repository/inventory.repository.js";

class InventoryReservationService {

  async reserveStock(
    productId: string,   
    warehouseId: string, 
    quantity: number
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

      const available =
        inventory.getDataValue("available_qty") -
        inventory.getDataValue("reserved_qty");

      if (available < quantity) {
        throw new Error("Insufficient stock");
      }

      inventory.set(
        "reserved_qty",
        inventory.getDataValue("reserved_qty") + quantity
      );

      await saveInventory(inventory, transaction);
    });
  }

  async releaseStock(
    productId: string,
    warehouseId: string,
    quantity: number
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

      const reserved = inventory.getDataValue("reserved_qty");

      if (reserved < quantity) {
        throw new Error("Cannot release more than reserved quantity");
      }

      inventory.set(
        "reserved_qty",
        reserved - quantity
      );

      await saveInventory(inventory, transaction);
    });
  }
}

export const inventoryReservationService =
  new InventoryReservationService();