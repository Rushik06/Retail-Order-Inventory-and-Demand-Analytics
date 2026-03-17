import type { Request, Response } from "express";
import { warehouseService } from "../services/warehouse.service.js";

/* CREATE */

export const createWarehouseController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { name, location } = req.body;

  const warehouse = await warehouseService.createWarehouse(
    name,
    location
  );

  res.status(201).json({
    message: "Warehouse created successfully",
    data: warehouse,
  });

};


/* GET ALL */

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


/* GET BY ID */

export const getWarehouseByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const warehouseId = req.params.id as string;

  const warehouse = await warehouseService.getWarehouseById(
    warehouseId
  );

  res.status(200).json({
    data: warehouse,
  });

};


/* UPDATE */

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
    message: "Warehouse updated successfully",
    data: updatedWarehouse,
  });

};


/* DEACTIVATE */

export const deactivateWarehouseController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const warehouseId = req.params.id as string;

  await warehouseService.deactivateWarehouse(warehouseId);

  res.status(200).json({
    message: "Warehouse deactivated successfully",
  });

};


/* ACTIVATE */

export const activateWarehouseController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const warehouseId = req.params.id as string;

  await warehouseService.activateWarehouse(warehouseId);

  res.status(200).json({
    message: "Warehouse activated successfully",
  });

};