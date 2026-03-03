import type { Request, Response } from "express";
import { inventoryReservationService } from "../services/inventory.reservation.service.js";

export const reserveStockController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, warehouseId, quantity } = req.body;

    await inventoryReservationService.reserveStock(
      Number(productId),
      Number(warehouseId),
      Number(quantity)
    );

    res.status(200).json({
      message: "Stock reserved successfully",
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(400).json({ message });
  }
};

export const releaseStockController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, warehouseId, quantity } = req.body;

    await inventoryReservationService.releaseStock(
      Number(productId),
      Number(warehouseId),
      Number(quantity)
    );

    res.status(200).json({
      message: "Stock released successfully",
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(400).json({ message });
  }
};