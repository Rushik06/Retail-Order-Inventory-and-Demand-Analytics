import { Warehouse } from "../models/warehouse.model.js";
import { Op } from "sequelize";
import { AppError } from "@repo/shared";
import { ERRORS } from "../constants/errors.js";

class WarehouseService {

  async createWarehouse(name: string, location: string): Promise<Warehouse> {

    const existing = await Warehouse.findOne({
      where: { name, location },
    });

    if (existing) {
      throw new AppError(ERRORS.WAREHOUSE_EXISTS, 409);
    }

    return await Warehouse.create({
      name,
      location,
      is_active: true,
    });
  }

  async getAllWarehouses(
    page = 1,
    limit = 10,
    search = "",
    sortField = "createdAt",
    sortOrder: "ASC" | "DESC" = "DESC"
  ) {
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { location: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await Warehouse.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortField, sortOrder]],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getWarehouseById(warehouseId: string): Promise<Warehouse> {

    const warehouse = await Warehouse.findOne({
      where: { warehouse_id: warehouseId },
    });

    if (!warehouse) {
      throw new AppError(ERRORS.WAREHOUSE_NOT_FOUND, 404);
    }

    return warehouse;
  }

  async updateWarehouse(
    warehouseId: string,
    name?: string,
    location?: string
  ): Promise<Warehouse> {

    const warehouse = await Warehouse.findByPk(warehouseId);

    if (!warehouse) {
      throw new AppError(ERRORS.WAREHOUSE_NOT_FOUND, 404);
    }

    if (name !== undefined) warehouse.set("name", name);
    if (location !== undefined) warehouse.set("location", location);

    await warehouse.save();

    return warehouse;
  }

  async deactivateWarehouse(warehouseId: string): Promise<void> {

    const warehouse = await Warehouse.findByPk(warehouseId);

    if (!warehouse) {
      throw new AppError(ERRORS.WAREHOUSE_NOT_FOUND, 404);
    }

    warehouse.set("is_active", false);
    await warehouse.save();
  }

  async activateWarehouse(warehouseId: string): Promise<void> {

    const warehouse = await Warehouse.findByPk(warehouseId);

    if (!warehouse) {
      throw new AppError(ERRORS.WAREHOUSE_NOT_FOUND, 404);
    }

    warehouse.set("is_active", true);
    await warehouse.save();
  }
}

export const warehouseService = new WarehouseService();