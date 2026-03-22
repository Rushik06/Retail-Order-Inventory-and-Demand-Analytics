/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn()
}));

vi.mock("../src/api/api-client", () => ({
  createApiClient: vi.fn(() => mockAxios)
}));

import {
  getAllInventory,
  getInventory,
  createInventory,
  addStock,
  deductStock,
  reserveStock,
  releaseStock,
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deactivateWarehouse,
  activateWarehouse
} from "../src/api/inventory-axios.js";

describe("Inventory API", () => {

  beforeEach(() => {
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();
    mockAxios.patch.mockClear();
  });

  /* INVENTORY */

  describe("getAllInventory", () => {

    it("calls GET /inventory with params", () => {
      const params = { page: 1, limit: 10, search: "laptop", sortField: "createdAt", sortOrder: "DESC" as const };
      getAllInventory(params);
      expect(mockAxios.get).toHaveBeenCalledWith("/inventory", { params });
    });

    it("calls GET /inventory with empty params", () => {
      getAllInventory({});
      expect(mockAxios.get).toHaveBeenCalledWith("/inventory", { params: {} });
    });

  });

  describe("getInventory", () => {

    it("calls GET /inventory/:productId/:warehouseId", () => {
      getInventory("prod-1", "wh-1");
      expect(mockAxios.get).toHaveBeenCalledWith("/inventory/prod-1/wh-1");
    });

  });

  describe("createInventory", () => {

    it("calls POST /inventory/create with data", () => {
      const data = { productId: "prod-1", warehouseId: "wh-1", availableQty: 100, reservedQty: 0 };
      createInventory(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/inventory/create", data);
    });

    it("calls POST /inventory/create without optional reservedQty", () => {
      const data = { productId: "prod-1", warehouseId: "wh-1", availableQty: 50 };
      createInventory(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/inventory/create", data);
    });

  });

  describe("addStock", () => {

    it("calls POST /inventory/add with data", () => {
      const data = { productId: "prod-1", warehouseId: "wh-1", quantity: 20, referenceId: "PO-001" };
      addStock(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/inventory/add", data);
    });

    it("calls POST /inventory/add without optional referenceId", () => {
      const data = { productId: "prod-1", warehouseId: "wh-1", quantity: 10 };
      addStock(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/inventory/add", data);
    });

  });

  describe("deductStock", () => {

    it("calls POST /inventory/deduct with data", () => {
      const data = { productId: "prod-1", warehouseId: "wh-1", quantity: 5, referenceId: "ORDER-001" };
      deductStock(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/inventory/deduct", data);
    });

  });

  describe("reserveStock", () => {

    it("calls POST /inventory/reserve with data", () => {
      const data = { productId: "prod-1", warehouseId: "wh-1", quantity: 3 };
      reserveStock(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/inventory/reserve", data);
    });

  });

  describe("releaseStock", () => {

    it("calls POST /inventory/release with data", () => {
      const data = { productId: "prod-1", warehouseId: "wh-1", quantity: 3 };
      releaseStock(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/inventory/release", data);
    });

  });

  /* WAREHOUSE */

  describe("createWarehouse", () => {

    it("calls POST /warehouse with data", () => {
      const data = { name: "Delhi Warehouse", location: "Delhi" };
      createWarehouse(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/warehouse", data);
    });

  });

  describe("getWarehouses", () => {

    it("calls GET /warehouse with params", () => {
      const params = { page: 1, limit: 10, search: "Delhi", sortField: "name", sortOrder: "ASC" as const };
      getWarehouses(params);
      expect(mockAxios.get).toHaveBeenCalledWith("/warehouse", { params });
    });

    it("calls GET /warehouse with empty params", () => {
      getWarehouses({});
      expect(mockAxios.get).toHaveBeenCalledWith("/warehouse", { params: {} });
    });

  });

  describe("getWarehouseById", () => {

    it("calls GET /warehouse/:id", () => {
      getWarehouseById("wh-1");
      expect(mockAxios.get).toHaveBeenCalledWith("/warehouse/wh-1");
    });

  });

  describe("updateWarehouse", () => {

    it("calls PATCH /warehouse/:id with full data", () => {
      updateWarehouse("wh-1", { name: "Updated", location: "Mumbai" });
      expect(mockAxios.patch).toHaveBeenCalledWith("/warehouse/wh-1", { name: "Updated", location: "Mumbai" });
    });

    it("calls PATCH /warehouse/:id with partial data", () => {
      updateWarehouse("wh-1", { name: "New Name" });
      expect(mockAxios.patch).toHaveBeenCalledWith("/warehouse/wh-1", { name: "New Name" });
    });

  });

  describe("deactivateWarehouse", () => {

    it("calls PATCH /warehouse/:id/deactivate", () => {
      deactivateWarehouse("wh-1");
      expect(mockAxios.patch).toHaveBeenCalledWith("/warehouse/wh-1/deactivate");
    });

  });

  describe("activateWarehouse", () => {

    it("calls PATCH /warehouse/:id/activate", () => {
      activateWarehouse("wh-1");
      expect(mockAxios.patch).toHaveBeenCalledWith("/warehouse/wh-1/activate");
    });

  });

});