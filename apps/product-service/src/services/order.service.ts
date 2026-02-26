import { randomUUID } from "crypto";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/orderItem.model.js";
import { Product } from "../models/product.model.js";

export const createOrder = async (
  customerName: string,
  items: { productId: string; quantity: number }[]
) => {
  if (!customerName || !items || items.length === 0) {
    throw new Error("Invalid order data");
  }

  let totalAmount = 0;

  // Calculate total amount
  for (const item of items) {
    const product = await Product.findByPk(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    totalAmount += Number(product.getDataValue("price")) * item.quantity;
  }

  //  Create order with totalAmount
  const order = await Order.create({
    id: randomUUID(),
    customerName,
    totalAmount,     
    status: "PENDING",
  });

  //Create order items
  for (const item of items) {
    await OrderItem.create({
      
      orderId: order.getDataValue("id"),   
      productId: item.productId,
      quantity: item.quantity,
    });
  }

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new Error("Order not found");
  }
console.log("Updating order status:", { orderId, status });
  order.set("status", status);
  await order.save();
console.log("Order status updated:", order.getDataValue("status"));
  return order;
};