import { sequelize } from "../config/index.js";
import type { Transaction } from "sequelize";
import { findInventory, saveInventory } from "../repository/inventory.repository.js";
import { AppError} from "@repo/shared";
import { ERRORS } from "../constants/errors.js";

class InventoryReservationService {

  async reserveStock(productId: string, warehouseId: string, quantity: number): Promise<void> {

    await sequelize.transaction(async (transaction: Transaction) => {

      const inventory = await findInventory(productId, warehouseId, transaction, true);

      if (!inventory) {
        throw new AppError(ERRORS.INVENTORY_NOT_FOUND, 404);
      }

      const available =
        inventory.getDataValue("available_qty") -
        inventory.getDataValue("reserved_qty");

      if (available < quantity) {
        throw new AppError(ERRORS.INSUFFICIENT_STOCK, 400);
      }

      inventory.set("reserved_qty",
        inventory.getDataValue("reserved_qty") + quantity
      );

      await saveInventory(inventory, transaction);
    });
  }

  async releaseStock(productId: string, warehouseId: string, quantity: number): Promise<void> {

    await sequelize.transaction(async (transaction: Transaction) => {

      const inventory = await findInventory(productId, warehouseId, transaction, true);

      if (!inventory) {
        throw new AppError(ERRORS.INVENTORY_NOT_FOUND, 404);
      }

      const reserved = inventory.getDataValue("reserved_qty");

      if (reserved < quantity) {
        throw new AppError("Cannot release more than reserved quantity", 400);
      }

      inventory.set("reserved_qty", reserved - quantity);

      await saveInventory(inventory, transaction);
    });
  }
}

export const inventoryReservationService = new InventoryReservationService();