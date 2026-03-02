import { randomUUID } from "crypto";
import { sequelize } from "../config/index.js";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/orderItem.model.js";
import { Product } from "../models/product.model.js";
import { Op } from "sequelize";

export const createOrder = async (
  customerName: string,
  items: { productId: string; quantity: number }[]
) => {
  if (!customerName || !items || items.length === 0) {
    throw new Error("Invalid order data");
  }

  const transaction = await sequelize.transaction();

  try {
    let totalAmount = 0;

    // Validate and calculate
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const stock = Number(product.getDataValue("stock"));

      if (stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.getDataValue("name")}`
        );
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

      // Auto mark stock status
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
      throw new Error("Order not found");
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

        // Auto restore stock status
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
/*eslint-disable @typescript-eslint/no-explicit-any */
export const getOrders = async ({
  page = 1,
  limit = 6,
  search = "",
  status = "",
  sort = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}) => {
  const offset = (page - 1) * limit;

  /* WHERE CONDITIONS */
  const where: any = {};

  if (search) {
    where.customerName = {
      [Op.iLike]: `%${search}%`, 
    };
  }

  if (status) {
    where.status = status;
  }

  /* SORTING */
  const order: any[] = [];

  switch (sort) {
    case "total_desc":
      order.push(["totalAmount", "DESC"]);
      break;

    case "total_asc":
      order.push(["totalAmount", "ASC"]);
      break;

    case "status_asc":
      order.push(["status", "ASC"]);
      break;

    case "status_desc":
      order.push(["status", "DESC"]);
      break;

    default:
      order.push(["createdAt", "DESC"]);
  }

  const { rows, count } = await Order.findAndCountAll({
    where,
    include: [
      {
        model: OrderItem,
        include: [Product],
      },
    ],
    limit,
    offset,
    order,
  });

  return {
    data: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
};