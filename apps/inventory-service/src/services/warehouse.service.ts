import { Warehouse } from "../models/warehouse.model.js";

class WarehouseService {

    /* CREATE WAREHOUSE */
    async createWarehouse(
        name: string,
        location: string
    ): Promise<Warehouse> {

        const existing = await Warehouse.findOne({
            where: { name },
        });

        if (existing) {
            throw new Error("Warehouse with this name already exists");
        }

        const warehouse = await Warehouse.create({
            name,
            location,
            is_active: true,
        });

        return warehouse;
    }


    /* GET ALL WAREHOUSES */
    async getAllWarehouses(): Promise<Warehouse[]> {

        return Warehouse.findAll({
            order: [["createdAt", "DESC"]],
        });
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


    /* UPDATE WAREHOUSE*/
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
export const warehouseService = new WarehouseService();