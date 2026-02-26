import type { Request, Response } from "express";
import * as service from "../services/order.service.js";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { customerName, items } = req.body as {
      customerName?: string;
      items?: {
        productId: string;
        quantity: number;
      }[];
    };

    if (!customerName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "customerName and items are required",
      });
    }

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
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    if (!req.body || !req.body.status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const { status } = req.body as { status: string };

    const order = await service.updateOrderStatus(id, status);

    return res.json(order);
  } catch (error: any) {
    console.error("Update Order Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};