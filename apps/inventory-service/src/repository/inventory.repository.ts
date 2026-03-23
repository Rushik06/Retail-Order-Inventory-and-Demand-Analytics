import { Inventory } from "../models/inventory.model.js";
import { sequelize } from "../config/index.js";
import type { Transaction, FindOptions } from "sequelize";

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

  if (transaction) options.transaction = transaction;
  if (lock && transaction) options.lock = transaction.LOCK.UPDATE;

  return Inventory.findOne(options);
};

export const saveInventory = async (
  inventory: Inventory,
  transaction: Transaction
) => {
  return inventory.save({ transaction });
};

export const getAllInventory = async () => {
  return await sequelize.query(
    `
    SELECT
      i.*,
      p.id           AS "product.id",
      p.name         AS "product.name",
      p.sku          AS "product.sku",
      w.warehouse_id AS "warehouse.id",
      w.name         AS "warehouse.name",
      w.location     AS "warehouse.location"
    FROM inventory i
    LEFT JOIN products   p ON p.id           = i.product_id
    LEFT JOIN warehouses w ON w.warehouse_id = i.warehouse_id
    `,
    { type: "SELECT", nest: true }
  );
};

export const getInventoryByProductWarehouse = async (
  productId: string,
  warehouseId: string
) => {
  const results = await sequelize.query(
    `
    SELECT
      i.*,
      p.id           AS "product.id",
      p.name         AS "product.name",
      p.sku          AS "product.sku",
      w.warehouse_id AS "warehouse.id",
      w.name         AS "warehouse.name",
      w.location     AS "warehouse.location"
    FROM inventory i
    LEFT JOIN products   p ON p.id           = i.product_id
    LEFT JOIN warehouses w ON w.warehouse_id = i.warehouse_id
    WHERE i.product_id   = :productId
      AND i.warehouse_id = :warehouseId
    LIMIT 1
    `,
    { type: "SELECT", nest: true, replacements: { productId, warehouseId } }
  );

  return results[0] || null;
};