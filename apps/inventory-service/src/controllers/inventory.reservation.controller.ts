import type { Request, Response } from "express";
import { inventoryReservationService } from "../services/inventory.reservation.service.js";

export const reserveStockController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { productId, warehouseId, quantity } = req.body;

  await inventoryReservationService.reserveStock(
    productId,
    warehouseId,
    Number(quantity)
  );

  res.status(200).json({
    message: "Stock reserved successfully",
  });

};

export const releaseStockController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { productId, warehouseId, quantity } = req.body;

  await inventoryReservationService.releaseStock(
    productId,
    warehouseId,
    Number(quantity)
  );

  res.status(200).json({
    message: "Stock released successfully",
  });

};