import type { Request, Response } from "express";
import { inventoryMovementService } from "../services/inventory.movement.js";

/* CREATE INVENTORY */

export const createInventoryController = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { productId, warehouseId, availableQty, reservedQty } = req.body;

    const inventory = await inventoryMovementService.createInventory(
      productId,
      warehouseId,
      Number(availableQty),
      Number(reservedQty ?? 0)
    );

    res.status(201).json({
      message: "Inventory created successfully",
      data: inventory
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(400).json({ message });

  }

};


/* ADD STOCK */

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


/* DEDUCT STOCK */

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