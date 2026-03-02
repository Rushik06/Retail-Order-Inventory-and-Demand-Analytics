import { Inventory } from "../models/inventory.model.js";
import type { Transaction, FindOptions } from "sequelize";

export const findInventory = async (
  productId: number,
  warehouseId: number,
  transaction?: Transaction,
  lock = false
) => {
  const options: FindOptions = {
    where: {
      product_id: productId,
      warehouse_id: warehouseId,
    },
  };

  if (transaction) {
    options.transaction = transaction;
  }

  if (lock && transaction) {
    options.lock = transaction.LOCK.UPDATE;
  }

  return Inventory.findOne(options);
};

export const saveInventory = async (
  inventory: Inventory,
  transaction: Transaction
) => {
  return inventory.save({ transaction });
};