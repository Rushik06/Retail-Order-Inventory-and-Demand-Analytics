import {
  getAllInventory,
  getInventoryByProductWarehouse
} from "../repository/inventory.repository.js";

class InventoryQueryService {

  async getAllInventory() {
    return getAllInventory();
  }

  async getInventory(
    productId: string,
    warehouseId: string
  ) {
    const inventory = await getInventoryByProductWarehouse(
      productId,
      warehouseId
    );

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    return inventory;
  }

}

export const inventoryQueryService =
  new InventoryQueryService();