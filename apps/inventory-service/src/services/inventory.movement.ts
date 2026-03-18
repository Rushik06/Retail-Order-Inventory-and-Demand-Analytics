import { sequelize } from "../config/index.js";
import type { Transaction } from "sequelize";
import { Inventory } from "../models/inventory.model.js";
import { InventoryLog } from "../models/inventorylog.model.js";
import { inventoryAlertService } from "../services/inventory.alert.js";
import { AppError } from "@repo/shared";

class InventoryMovementService {

  /* CREATE INVENTORY */

  async createInventory(
    productId: string,
    warehouseId: string,
    availableQty: number,
    reservedQty: number = 0
  ): Promise<Inventory> {
  console.log(productId)
    return await sequelize.transaction(async (transaction: Transaction) => {

      const existing = await Inventory.findOne({
        where: {
          product_id: productId,
          warehouse_id: warehouseId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (existing) {
        throw new AppError("Inventory already exists for this product and warehouse",409);
      }

      const inventory = await Inventory.create(
        {
          product_id: productId,
          warehouse_id: warehouseId,
          available_qty: availableQty,
          reserved_qty: reservedQty,
        },
        { transaction }
      );

      await InventoryLog.create(
        {
          product_id: productId,
          warehouse_id: warehouseId,
          action_type: "CREATE",
          previous_available_qty: 0,
          new_available_qty: availableQty,
          reference_id: null,
        },
        { transaction }
      );

      await inventoryAlertService.checkLowStock(
        productId,
        warehouseId,
        10,
        transaction
      );

      return inventory;

    });
  }

  /* ADD STOCK */

  async addStock(
    productId: string,
    warehouseId: string,
    quantity: number,
    referenceId?: string
  ): Promise<void> {

    await sequelize.transaction(async (transaction: Transaction) => {

      const [inventory] = await Inventory.findOrCreate({
        where: {
          product_id: productId,
          warehouse_id: warehouseId,
        },
        defaults: {
          product_id: productId,
          warehouse_id: warehouseId,
          available_qty: 0,
          reserved_qty: 0,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      const previous = inventory.getDataValue("available_qty");

      inventory.set("available_qty", previous + quantity);

      await inventory.save({ transaction });

      await inventoryAlertService.checkLowStock(
        productId,
        warehouseId,
        10,
        transaction
      );

      await InventoryLog.create(
        {
          product_id: productId,
          warehouse_id: warehouseId,
          action_type: "INBOUND",
          previous_available_qty: previous,
          new_available_qty: previous + quantity,
          reference_id: referenceId ?? null,
        },
        { transaction }
      );

    });
  }

  /* DEDUCT STOCK */

  async deductStock(
    productId: string,
    warehouseId: string,
    quantity: number,
    referenceId: string
  ): Promise<void> {

    await sequelize.transaction(async (transaction: Transaction) => {

      const [inventory] = await Inventory.findOrCreate({
        where: {
          product_id: productId,
          warehouse_id: warehouseId,
        },
        defaults: {
          product_id: productId,
          warehouse_id: warehouseId,
          available_qty: 0,
          reserved_qty: 0,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      const previous = inventory.getDataValue("available_qty");
      const reserved = inventory.getDataValue("reserved_qty");
      const effectiveAvailable = previous - reserved;

      if (effectiveAvailable < quantity) {
        throw new AppError("Insufficient stock",400);
      }

      inventory.set("available_qty", previous - quantity);

      await inventory.save({ transaction });

      await inventoryAlertService.checkLowStock(
        productId,
        warehouseId,
        10,
        transaction
      );

      await InventoryLog.create(
        {
          product_id: productId,
          warehouse_id: warehouseId,
          action_type: "OUTBOUND",
          previous_available_qty: previous,
          new_available_qty: previous - quantity,
          reference_id: referenceId,
        },
        { transaction }
      );

    });
  }
}

export const inventoryMovementService = new InventoryMovementService();