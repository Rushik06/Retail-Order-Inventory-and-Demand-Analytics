/*eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from "express";
import * as service from "../services/order.service.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validations/order.schema.js";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsed = createOrderSchema.safeParse({
      body: req.body,
    });

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]!.message,
      });
    }

    const { customerName, items } = parsed.data.body;

    const order = await service.createOrder(customerName, items);

    return res.status(201).json(order);
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsed = updateOrderStatusSchema.safeParse({
      params: req.params,
      body: req.body,
    });

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]!.message,
      });
    }

    const { id } = parsed.data.params;
    const { status } = parsed.data.body;

    const order = await service.updateOrderStatus(id, status);

    return res.json(order);
  } catch (error: any) {
    console.error("Update Order Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const getOrders = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const orders = await service.getOrders();
  return res.json(orders);
};