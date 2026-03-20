import type { Request, Response } from "express";
import { warehouseService } from "../services/warehouse.service.js";
import { MESSAGES } from "../constants/messages.js";

/*CREATE - WAREHOUSE */
export const createWarehouseController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, location } = req.body;

  const warehouse = await warehouseService.createWarehouse(name, location);

  res.status(201).json({
    message: MESSAGES.WAREHOUSE_CREATED,
    data: warehouse,
  });
};

/*GET ALL WAREHOUSE */
export const getAllWarehousesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = (req.query.search as string) || "";
  const sortField = (req.query.sortField as string) || "createdAt";
  const sortOrder = (req.query.sortOrder as "ASC" | "DESC") || "DESC";

  const result = await warehouseService.getAllWarehouses(
    page,
    limit,
    search,
    sortField,
    sortOrder
  );

  res.status(200).json(result);
};

/*GET WAREHOUSE BY ID */
export const getWarehouseByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const warehouseId = req.params.id as string;

  const warehouse = await warehouseService.getWarehouseById(warehouseId);

  res.status(200).json({ data: warehouse });
};

export const updateWarehouseController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const warehouseId = req.params.id as string;
  const { name, location } = req.body;

  const updatedWarehouse = await warehouseService.updateWarehouse(
    warehouseId,
    name,
    location
  );

  res.status(200).json({
    message: MESSAGES.WAREHOUSE_UPDATED,
    data: updatedWarehouse,
  });
};

export const deactivateWarehouseController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const warehouseId = req.params.id as string;

  await warehouseService.deactivateWarehouse(warehouseId);

  res.status(200).json({ message: MESSAGES.WAREHOUSE_DEACTIVATED });
};

export const activateWarehouseController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const warehouseId = req.params.id as string;

  await warehouseService.activateWarehouse(warehouseId);

  res.status(200).json({ message: MESSAGES.WAREHOUSE_ACTIVATED });
};