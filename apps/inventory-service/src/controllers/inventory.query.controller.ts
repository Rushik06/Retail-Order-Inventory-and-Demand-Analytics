import type { Request, Response } from "express";
import { inventoryQueryService } from "../services/inventory.query.service.js";


/*GET ALL INVENTORY*/
export const getAllInventoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page, limit, search, sortField, sortOrder } = req.query;

  const inventory = await inventoryQueryService.getAllInventory({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    search: String(search || ""),
    sortField: String(sortField || "createdAt"),
    sortOrder: (sortOrder as "ASC" | "DESC") || "DESC",
  });

  res.status(200).json(inventory);
};

/*GET INVENTORY BY PRODUCT AND WAREHOUSE ID */
export const getInventoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.productId as string;
  const warehouseId = req.params.warehouseId as string;

  const inventory = await inventoryQueryService.getInventory(
    productId,
    warehouseId
  );

  res.status(200).json({ data: inventory });
};