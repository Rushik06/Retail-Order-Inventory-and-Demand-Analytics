/*eslint-disable*/
import { ERRORS } from "../constants/errors.js";
import {
  getAllInventory,
  getInventoryByProductWarehouse
} from "../repository/inventory.repository.js";
import { AppError } from "@repo/shared";

class InventoryQueryService {

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

      if (!searchValue) return true;

      const sku =
        item.product?.sku?.toLowerCase?.() || "";

      const productName =
        item.product?.name?.toLowerCase?.() || "";

      const warehouseName =
        item.warehouse?.name?.toLowerCase?.() || "";

      const location =
        item.warehouse?.location?.toLowerCase?.() || "";

      return (
        sku.includes(searchValue) ||
        productName.includes(searchValue) ||
        warehouseName.includes(searchValue) ||
        location.includes(searchValue)
      );

    });

    /* SORT */

    const sorted = filtered.sort((a: any, b: any) => {

      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "sku":
          aValue = a.product?.sku || "";
          bValue = b.product?.sku || "";
          break;

        case "product_id":
        case "productName":
          aValue = a.product?.name || "";
          bValue = b.product?.name || "";
          break;

        case "warehouse_id":
        case "warehouseName":
          aValue = a.warehouse?.name || "";
          bValue = b.warehouse?.name || "";
          break;

        case "location":
          aValue = a.warehouse?.location || "";
          bValue = b.warehouse?.location || "";
          break;

        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue === bValue) return 0;

      if (sortOrder === "ASC") {
        return aValue > bValue ? 1 : -1;
      }

      return aValue < bValue ? 1 : -1;

    });

    /* PAGINATION */

    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

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

  async getInventory(
    productId: string,
    warehouseId: string
  ) {

    const inventory = await getInventoryByProductWarehouse(
      productId,
      warehouseId
    );

    if (!inventory) {
      throw new AppError(ERRORS.INVENTORY_NOT_FOUND, 404);
    }

    return inventory;

  }

}

export const inventoryQueryService = new InventoryQueryService();