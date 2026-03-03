import type { Request, Response } from "express";
import { inventoryMovementService } from "../services/inventory.movement.js";

export const addStockController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, warehouseId, quantity, referenceId } = req.body;

    await inventoryMovementService.addStock(
      productId,                
      warehouseId,              
      Number(quantity),          
      referenceId ?? undefined   
    );

    res.status(200).json({
      message: "Stock added successfully",
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(400).json({ message });
  }
};

export const deductStockController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, warehouseId, quantity, referenceId } = req.body;

    await inventoryMovementService.deductStock(
      productId,              
      warehouseId,            
      Number(quantity),
      referenceId            
    );

    res.status(200).json({
      message: "Stock deducted successfully",
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(400).json({ message });
  }
};