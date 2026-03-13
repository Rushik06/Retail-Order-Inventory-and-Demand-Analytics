import type { Request, Response } from "express";
import { inventoryQueryService } from "../services/inventory.query.service.js";

/* GET ALL INVENTORY */

export const getAllInventoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      page,
      limit,
      search,
      sortField,
      sortOrder
    } = req.query;

    const inventory = await inventoryQueryService.getAllInventory({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: String(search || ""),
      sortField: String(sortField || "createdAt"),
      sortOrder: (sortOrder as "ASC" | "DESC") || "DESC"
    });

    res.status(200).json(inventory);

  } catch (error: unknown) {

    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(500).json({ message });
  }
};


/* GET INVENTORY BY PRODUCT AND WAREHOUSE */

export const getInventoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const productId = req.params.id as string;
    const warehouseId = req.params.id as string;

    const inventory = await inventoryQueryService.getInventory(
      productId,
      warehouseId
    );

    res.status(200).json({
      data: inventory
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(404).json({ message });

  }
};