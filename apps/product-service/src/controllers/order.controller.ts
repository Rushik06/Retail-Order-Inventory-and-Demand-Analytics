import type { Request, Response } from "express";
import * as service from "../services/order.service.js";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { customerName, items } = req.body as {
    customerName: string;
    items: {
      productId: string;
      quantity: number;
    }[];
  };

  const order = await service.createOrder(customerName, items);

  return res.status(201).json(order);
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const { status } = req.body as { status: string };

  const order = await service.updateOrderStatus(id, status);

  return res.json(order);
};