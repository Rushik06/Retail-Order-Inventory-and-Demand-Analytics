import { randomUUID } from "crypto";
import { sequelize } from "../config/index.js";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/orderItem.model.js";
import { Product } from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";
import { ERRORS } from "../constants/errors.js";

export const createOrder = async (
  customerName: string,
  items: { productId: string; quantity: number }[]
) => {

  if (!customerName || !items || items.length === 0) {
    throw new AppError(ERRORS.INVALID_ORDER_DATA, 400);
  }

  const transaction = await sequelize.transaction();

  try {

    let totalAmount = 0;

    // Validate and calculate
    for (const item of items) {

      const product = await Product.findByPk(item.productId, { transaction });

      if (!product) {
        throw new AppError(ERRORS.PRODUCT_NOT_FOUND, 404);
      }

      const stock = Number(product.getDataValue("stock"));

      if (stock < item.quantity) {
        throw new AppError(ERRORS.INSUFFICIENT_STOCK, 400);
      }

      totalAmount +=
        Number(product.getDataValue("price")) * item.quantity;
    }

    // Create order
    const order = await Order.create(
      {
        id: randomUUID(),
        customerName,
        totalAmount,
        status: "PENDING",
      },
      { transaction }
    );

    // stock deduction & order items creation
    for (const item of items) {

      const product = await Product.findByPk(item.productId, { transaction });

      const newStock =
        Number(product!.getDataValue("stock")) - item.quantity;

      product!.set("stock", newStock);

      product!.set(
        "status",
        newStock === 0 ? "OUT_OF_STOCK" : "IN_STOCK"
      );

      await product!.save({ transaction });

      await OrderItem.create(
        {
          orderId: order.getDataValue("id"),
          productId: item.productId,
          quantity: item.quantity,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return order;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
) => {

  const transaction = await sequelize.transaction();

  try {

    const order = await Order.findByPk(orderId, {
      include: [OrderItem],
      transaction,
    });

    if (!order) {
      throw new AppError(ERRORS.ORDER_NOT_FOUND, 404);
    }

    const currentStatus = order.getDataValue("status");

    if (status === "CANCELLED" && currentStatus !== "CANCELLED") {

      const orderItems = await OrderItem.findAll({
        where: { orderId },
        transaction,
      });

      for (const item of orderItems) {

        const product = await Product.findByPk(
          item.getDataValue("productId"),
          { transaction }
        );

        const restoredStock =
          Number(product!.getDataValue("stock")) +
          Number(item.getDataValue("quantity"));

        product!.set("stock", restoredStock);

        product!.set("status", "IN_STOCK");

        await product!.save({ transaction });
      }
    }

    order.set("status", status);
    await order.save({ transaction });

    await transaction.commit();
    return order;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getOrders = async () => {

  return Order.findAll({
    include: [
      {
        model: OrderItem,
        include: [Product],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

};