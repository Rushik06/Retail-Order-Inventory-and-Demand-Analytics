import { Warehouse } from "../models/warehouse.model.js";
import { Op } from "sequelize";

class WarehouseService {

    /* CREATE WAREHOUSE */
    async createWarehouse(
        name: string,
        location: string
    ): Promise<Warehouse> {

        const existing = await Warehouse.findOne({
            where: { name ,location},
        });

        if (existing) {
            throw new Error("Warehouse already exists in this location");
        }

        const warehouse = await Warehouse.create({
            name,
            location,
            is_active: true,
        });

        return warehouse;
    }


    /* GET ALL WAREHOUSES*/

    async getAllWarehouses(
        page: number = 1,
        limit: number = 10,
        search: string = "",
        sortField: string = "createdAt",
        sortOrder: "ASC" | "DESC" = "DESC"
    ) {

        const offset = (page - 1) * limit;

        const whereClause = search
            ? {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${search}%`,
                        },
                    },
                    {
                        location: {
                            [Op.iLike]: `%${search}%`,
                        },
                    },
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


    /* GET WAREHOUSE BY ID */

    async getWarehouseById(
        warehouseId: string
    ): Promise<Warehouse> {

        const warehouse = await Warehouse.findOne({
            where: { warehouse_id: warehouseId },
        });

        if (!warehouse) {
            throw new Error("Warehouse not found");
        }

        return warehouse;
    }


    /* UPDATE WAREHOUSE */

    async updateWarehouse(
        warehouseId: string,
        name?: string,
        location?: string
    ): Promise<Warehouse> {

        const warehouse = await Warehouse.findByPk(warehouseId);

        if (!warehouse) {
            throw new Error("Warehouse not found");
        }

        if (name !== undefined) {
            warehouse.set("name", name);
        }

        if (location !== undefined) {
            warehouse.set("location", location);
        }

        await warehouse.save();

        return warehouse;
    }


    /* DEACTIVATE WAREHOUSE */

    async deactivateWarehouse(
        warehouseId: string
    ): Promise<void> {

        const warehouse = await Warehouse.findByPk(warehouseId);

        if (!warehouse) {
            throw new Error("Warehouse not found");
        }

        warehouse.set("is_active", false);

        await warehouse.save();
    }


    /* ACTIVATE WAREHOUSE */

    async activateWarehouse(
        warehouseId: string
    ): Promise<void> {

        const warehouse = await Warehouse.findByPk(warehouseId);

        if (!warehouse) {
            throw new Error("Warehouse not found");
        }

        warehouse.set("is_active", true);

        await warehouse.save();
    }
}

export const warehouseService = new WarehouseService()