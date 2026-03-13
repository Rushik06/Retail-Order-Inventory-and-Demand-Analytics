/*eslint-disable*/
import {

  getAllInventory,
  getInventoryByProductWarehouse
} from "../repository/inventory.repository.js";

class InventoryQueryService {

  /* GET ALL INVENTORY WITH PAGINATION SEARCH SORT */

  async getAllInventory(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: string;
    sortOrder?: "ASC" | "DESC";
  }) {

    const {
      page = 1,
      limit = 10,
      search = "",
      sortField = "createdAt",
      sortOrder = "DESC"
    } = params || {};

    const allInventory = await getAllInventory();

    const searchValue = search.toLowerCase();

    /* SEARCH */

    const filtered = allInventory.filter((item: any) => {

      const productId =
        item.product_id?.toLowerCase?.() || "";

      const warehouseId =
        item.warehouse_id?.toLowerCase?.() || "";

      return (
        productId.includes(searchValue) ||
        warehouseId.includes(searchValue)
      );

    });
    /* SORT */

    const sorted = filtered.sort((a: any, b: any) => {

      let aValue: any;
      let bValue: any;

      if (sortField === "product_id") {
        aValue = a.product?.name || "";
        bValue = b.product?.name || "";
      }

      else if (sortField === "warehouse_id") {
        aValue = a.warehouse?.name || "";
        bValue = b.warehouse?.name || "";
      }

      else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "ASC") {
        return aValue > bValue ? 1 : -1;
      }

      return aValue < bValue ? 1 : -1;

    });

    /* PAGINATION */

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = sorted.slice(start, end);

    return {
      data: paginated,
      meta: {
        page,
        limit,
        total: sorted.length,
        totalPages: Math.ceil(sorted.length / limit)
      }
    };

  }

  /* GET INVENTORY BY PRODUCT AND WAREHOUSE */

  async getInventory(
    productId: string,
    warehouseId: string
  ) {

    const inventory =
      await getInventoryByProductWarehouse(
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