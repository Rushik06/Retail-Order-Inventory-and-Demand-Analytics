import { Op } from "sequelize";
import { Inventory } from "../models/inventory.model.js";
import { inventoryMovementService } from "./inventory.movement.js";
import { getChannel } from "../utils/rabbitmq.js";
import { logger } from "@repo/shared";

export const startOrderCreatedConsumer = (): void => {
  const channel = getChannel();

  logger.info("Order created consumer started");

  channel.consume("inventory.order.created", async (msg) => {
    if (!msg) return;

    try {
      const { orderId, items } = JSON.parse(msg.content.toString());

      logger.info({ orderId }, "ORDER_CREATED event received");

      for (const item of items) {
        await fulfillFromWarehouses(orderId, item.productId, item.quantity);
      }

      channel.ack(msg);

    } catch (error) {
      logger.error({ err: error }, "Failed processing ORDER_CREATED event");
      channel.nack(msg, false, false);
    }
  });
};

const fulfillFromWarehouses = async (
  orderId: string,
  productId: string,
  quantity: number
): Promise<void> => {

  let remaining = quantity;

  const inventories = await Inventory.findAll({
    where: {
      product_id: productId,
      available_qty: { [Op.gt]: 0 },
    },
    order: [["available_qty", "DESC"]],
  });

  if (!inventories.length) {
    throw new Error(`No stock available for product ${productId}`);
  }

  const totalAvailable = inventories.reduce(
    (sum, inv) => sum + Number(inv.getDataValue("available_qty")),
    0
  );

  if (totalAvailable < quantity) {
    throw new Error(
      `Insufficient stock across all warehouses for product ${productId}`
    );
  }

  for (const inventory of inventories) {
    if (remaining <= 0) break;

    const warehouseId = inventory.getDataValue("warehouse_id");
    const available = Number(inventory.getDataValue("available_qty"));
    const deductQty = Math.min(available, remaining);

    await inventoryMovementService.deductStock(
      productId,
      warehouseId,
      deductQty,
      orderId
    );

    logger.info(
      { productId, warehouseId, deductQty, remaining: remaining - deductQty },
      "Stock deducted from warehouse"
    );

    remaining -= deductQty;
  }

  logger.info({ orderId, productId, quantity }, "Order fulfillment complete");
};