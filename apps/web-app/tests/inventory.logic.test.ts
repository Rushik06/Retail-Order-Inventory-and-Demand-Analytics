/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/api/inventory-axios", () => ({
  getAllInventory: vi.fn(),
  getInventory: vi.fn(),
  createInventory: vi.fn(),
  addStock: vi.fn(),
  deductStock: vi.fn(),
  reserveStock: vi.fn(),
  releaseStock: vi.fn(),
  createWarehouse: vi.fn(),
  getWarehouses: vi.fn(),
  getWarehouseById: vi.fn(),
  updateWarehouse: vi.fn(),
  deactivateWarehouse: vi.fn(),
  activateWarehouse: vi.fn()
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

import {
  fetchInventory,
  fetchInventoryByProductWarehouse,
  createNewInventory,
  addInventoryStock,
  deductInventoryStock,
  reserveInventoryStock,
  releaseInventoryStock,
  createNewWarehouse,
  fetchWarehouses,
  fetchWarehouseById,
  updateExistingWarehouse,
  deactivateExistingWarehouse,
  activateExistingWarehouse
} from "../src/app/inventory.logic.js";

describe("Inventory Actions", () => {

  beforeEach(() => {
    (getAllInventory as any).mockClear();
    (getInventory as any).mockClear();
    (createInventory as any).mockClear();
    (addStock as any).mockClear();
    (deductStock as any).mockClear();
    (reserveStock as any).mockClear();
    (releaseStock as any).mockClear();
    (createWarehouse as any).mockClear();
    (getWarehouses as any).mockClear();
    (getWarehouseById as any).mockClear();
    (updateWarehouse as any).mockClear();
    (deactivateWarehouse as any).mockClear();
    (activateWarehouse as any).mockClear();
  });

  /* INVENTORY */

  describe("fetchInventory", () => {

    it("calls getAllInventory with params and returns data", async () => {
      const mockData = [{ id: "inv-1" }];
      (getAllInventory as any).mockResolvedValue({ data: mockData });

      const params = { page: 1, limit: 10, search: "laptop" };
      const result = await fetchInventory(params);

      expect(getAllInventory).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockData);
    });

    it("calls getAllInventory with empty object when no params", async () => {
      (getAllInventory as any).mockResolvedValue({ data: [] });

      await fetchInventory();

      expect(getAllInventory).toHaveBeenCalledWith({});
    });

  });

  describe("fetchInventoryByProductWarehouse", () => {

    it("calls getInventory with productId and warehouseId, returns data", async () => {
      const mockData = { id: "inv-1", available_qty: 100 };
      (getInventory as any).mockResolvedValue({ data: mockData });

      const result = await fetchInventoryByProductWarehouse("prod-1", "wh-1");

      expect(getInventory).toHaveBeenCalledWith("prod-1", "wh-1");
      expect(result).toEqual(mockData);
    });

  });

  describe("createNewInventory", () => {

    it("calls createInventory with all args and returns data", async () => {
      const mockData = { id: "inv-1", available_qty: 100 };
      (createInventory as any).mockResolvedValue({ data: mockData });

      const result = await createNewInventory("prod-1", "wh-1", 100, 0);

      expect(createInventory).toHaveBeenCalledWith({
        productId: "prod-1",
        warehouseId: "wh-1",
        availableQty: 100,
        reservedQty: 0
      });
      expect(result).toEqual(mockData);
    });

    it("calls createInventory without optional reservedQty", async () => {
      (createInventory as any).mockResolvedValue({ data: {} });

      await createNewInventory("prod-1", "wh-1", 50);

      expect(createInventory).toHaveBeenCalledWith({
        productId: "prod-1",
        warehouseId: "wh-1",
        availableQty: 50,
        reservedQty: undefined
      });
    });

  });

  describe("addInventoryStock", () => {

    it("calls addStock with all args and returns data", async () => {
      (addStock as any).mockResolvedValue({ data: { message: "Stock added" } });

      const result = await addInventoryStock("prod-1", "wh-1", 20, "PO-001");

      expect(addStock).toHaveBeenCalledWith({
        productId: "prod-1",
        warehouseId: "wh-1",
        quantity: 20,
        referenceId: "PO-001"
      });
      expect(result).toEqual({ message: "Stock added" });
    });

    it("calls addStock without optional referenceId", async () => {
      (addStock as any).mockResolvedValue({ data: {} });

      await addInventoryStock("prod-1", "wh-1", 10);

      expect(addStock).toHaveBeenCalledWith({
        productId: "prod-1",
        warehouseId: "wh-1",
        quantity: 10,
        referenceId: undefined
      });
    });

  });

  describe("deductInventoryStock", () => {

    it("calls deductStock with all args and returns data", async () => {
      (deductStock as any).mockResolvedValue({ data: { message: "Stock deducted" } });

      const result = await deductInventoryStock("prod-1", "wh-1", 5, "ORDER-001");

      expect(deductStock).toHaveBeenCalledWith({
        productId: "prod-1",
        warehouseId: "wh-1",
        quantity: 5,
        referenceId: "ORDER-001"
      });
      expect(result).toEqual({ message: "Stock deducted" });
    });

  });

  describe("reserveInventoryStock", () => {

    it("calls reserveStock with args and returns data", async () => {
      (reserveStock as any).mockResolvedValue({ data: { message: "Stock reserved" } });

      const result = await reserveInventoryStock("prod-1", "wh-1", 3);

      expect(reserveStock).toHaveBeenCalledWith({
        productId: "prod-1",
        warehouseId: "wh-1",
        quantity: 3
      });
      expect(result).toEqual({ message: "Stock reserved" });
    });

  });

  describe("releaseInventoryStock", () => {

    it("calls releaseStock with args and returns data", async () => {
      (releaseStock as any).mockResolvedValue({ data: { message: "Stock released" } });

      const result = await releaseInventoryStock("prod-1", "wh-1", 3);

      expect(releaseStock).toHaveBeenCalledWith({
        productId: "prod-1",
        warehouseId: "wh-1",
        quantity: 3
      });
      expect(result).toEqual({ message: "Stock released" });
    });

  });

  /* WAREHOUSE */

  describe("createNewWarehouse", () => {

    it("calls createWarehouse with name and location, returns data", async () => {
      const mockData = { id: "wh-1", name: "Delhi Warehouse" };
      (createWarehouse as any).mockResolvedValue({ data: mockData });

      const result = await createNewWarehouse("Delhi Warehouse", "Delhi");

      expect(createWarehouse).toHaveBeenCalledWith({ name: "Delhi Warehouse", location: "Delhi" });
      expect(result).toEqual(mockData);
    });

  });

  describe("fetchWarehouses", () => {

    it("calls getWarehouses with params and returns data", async () => {
      const mockData = [{ id: "wh-1", name: "Delhi" }];
      (getWarehouses as any).mockResolvedValue({ data: mockData });

      const params = { page: 1, limit: 10, search: "Delhi" };
      const result = await fetchWarehouses(params);

      expect(getWarehouses).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockData);
    });

  });

  describe("fetchWarehouseById", () => {

    it("calls getWarehouseById with id and returns data", async () => {
      const mockData = { id: "wh-1", name: "Delhi" };
      (getWarehouseById as any).mockResolvedValue({ data: mockData });

      const result = await fetchWarehouseById("wh-1");

      expect(getWarehouseById).toHaveBeenCalledWith("wh-1");
      expect(result).toEqual(mockData);
    });

  });

  describe("updateExistingWarehouse", () => {

    it("calls updateWarehouse with id and data, returns data", async () => {
      const mockData = { id: "wh-1", name: "Updated" };
      (updateWarehouse as any).mockResolvedValue({ data: mockData });

      const result = await updateExistingWarehouse("wh-1", { name: "Updated", location: "Mumbai" });

      expect(updateWarehouse).toHaveBeenCalledWith("wh-1", { name: "Updated", location: "Mumbai" });
      expect(result).toEqual(mockData);
    });

    it("calls updateWarehouse with partial data", async () => {
      (updateWarehouse as any).mockResolvedValue({ data: {} });

      await updateExistingWarehouse("wh-1", { name: "New Name" });

      expect(updateWarehouse).toHaveBeenCalledWith("wh-1", { name: "New Name" });
    });

  });

  describe("deactivateExistingWarehouse", () => {

    it("calls deactivateWarehouse with id and returns data", async () => {
      (deactivateWarehouse as any).mockResolvedValue({ data: { message: "Deactivated" } });

      const result = await deactivateExistingWarehouse("wh-1");

      expect(deactivateWarehouse).toHaveBeenCalledWith("wh-1");
      expect(result).toEqual({ message: "Deactivated" });
    });

  });

  describe("activateExistingWarehouse", () => {

    it("calls activateWarehouse with id and returns data", async () => {
      (activateWarehouse as any).mockResolvedValue({ data: { message: "Activated" } });

      const result = await activateExistingWarehouse("wh-1");

      expect(activateWarehouse).toHaveBeenCalledWith("wh-1");
      expect(result).toEqual({ message: "Activated" });
    });

  });

});