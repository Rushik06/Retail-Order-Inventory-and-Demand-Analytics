import { Inventory } from "../models/inventory.model.js";
import type { Transaction, FindOptions } from "sequelize";

/* EXISTING CODE */

export const findInventory = async (
  productId: string,
  warehouseId: string,
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


export const getAllInventory = async () => {
  return Inventory.findAll();
};

export const getInventoryByProductWarehouse = async (
  productId: string,
  warehouseId: string
) => {
  return Inventory.findOne({
    where: {
      product_id: productId,
      warehouse_id: warehouseId,
    },
  });
};