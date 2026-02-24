/*eslint-disable @typescript-eslint/no-explicit-any */
import * as service from "../services/order.service.js";
export const createOrder = async (req: any, res: any) => {
  const { customerName, items } = req.body;

  const order = await service.createOrder(customerName, items);
  res.status(201).json(order);
};

export const updateOrderStatus = async (req: any, res: any) => {
  const order = await service.updateOrderStatus(
    req.params.id,
    req.body.status
  );

  res.json(order);
};