/*eslint-disable */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { warehouseService } from "../src/services/warehouse.service.js";
import { Warehouse } from "../src/models/warehouse.model.js";

/* MOCKS */

vi.mock("../src/models/warehouse.model.js", () => ({
  Warehouse: {
    findOne: vi.fn(),
    findAndCountAll: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn()
  }
}));

vi.mock("../src/constants/errors.js", () => ({
  ERRORS: {
    WAREHOUSE_EXISTS: "Warehouse already exists in this location",
    WAREHOUSE_NOT_FOUND: "Warehouse not found"
  }
}));

vi.mock("@repo/shared", () => ({
  AppError: class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

vi.mock("sequelize", () => ({
  Op: {
    or: Symbol("or"),
    iLike: Symbol("iLike")
  }
}));

describe("WarehouseService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE WAREHOUSE */

  describe("createWarehouse", () => {

    it("should create a warehouse successfully", async () => {

      (Warehouse.findOne as any).mockResolvedValue(null);

      const createdWarehouse = {
        name: "Delhi Warehouse",
        location: "Delhi",
        is_active: true
      };

      (Warehouse.create as any).mockResolvedValue(createdWarehouse);

      const result = await warehouseService.createWarehouse(
        "Delhi Warehouse",
        "Delhi"
      );

      expect(Warehouse.findOne).toHaveBeenCalledWith({
        where: { name: "Delhi Warehouse", location: "Delhi" }
      });

      expect(Warehouse.create).toHaveBeenCalledWith({
        name: "Delhi Warehouse",
        location: "Delhi",
        is_active: true
      });

      expect(result).toEqual(createdWarehouse);

    });

    it("should throw 409 error if warehouse already exists", async () => {

      (Warehouse.findOne as any).mockResolvedValue({ id: "1" });

      await expect(
        warehouseService.createWarehouse("Delhi", "Delhi")
      ).rejects.toThrow("Warehouse already exists in this location");

      expect(Warehouse.create).not.toHaveBeenCalled();

    });

  });

  /* GET ALL WAREHOUSES */

  describe("getAllWarehouses", () => {

    it("should return paginated warehouses", async () => {

      const mockResult = {
        rows: [
          { name: "Delhi", location: "Delhi" },
          { name: "Agra", location: "UP" }
        ],
        count: 2
      };

      (Warehouse.findAndCountAll as any).mockResolvedValue(mockResult);

      const result = await warehouseService.getAllWarehouses(
        1, 10, "", "createdAt", "DESC"
      );

      expect(Warehouse.findAndCountAll).toHaveBeenCalled();

      expect(result.data.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);

    });

    it("should calculate correct offset for page 2", async () => {

      (Warehouse.findAndCountAll as any).mockResolvedValue({ rows: [], count: 0 });

      await warehouseService.getAllWarehouses(2, 10, "", "createdAt", "DESC");

      expect(Warehouse.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ offset: 10, limit: 10 })
      );

    });

    it("should pass search clause when search is provided", async () => {

      (Warehouse.findAndCountAll as any).mockResolvedValue({ rows: [], count: 0 });

      await warehouseService.getAllWarehouses(1, 10, "Delhi", "createdAt", "DESC");

      expect(Warehouse.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object)
        })
      );

    });

    it("should pass empty where clause when search is empty", async () => {

      (Warehouse.findAndCountAll as any).mockResolvedValue({ rows: [], count: 0 });

      await warehouseService.getAllWarehouses(1, 10, "", "createdAt", "DESC");

      expect(Warehouse.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );

    });

    it("should calculate totalPages correctly", async () => {

      (Warehouse.findAndCountAll as any).mockResolvedValue({ rows: [], count: 25 });

      const result = await warehouseService.getAllWarehouses(1, 10, "", "createdAt", "DESC");

      expect(result.totalPages).toBe(3);

    });

  });

  /* GET WAREHOUSE BY ID */

  describe("getWarehouseById", () => {

    it("should return warehouse by id", async () => {

      const warehouse = { warehouse_id: "1", name: "Delhi" };

      (Warehouse.findOne as any).mockResolvedValue(warehouse);

      const result = await warehouseService.getWarehouseById("1");

      expect(Warehouse.findOne).toHaveBeenCalledWith({
        where: { warehouse_id: "1" }
      });

      expect(result).toEqual(warehouse);

    });

    it("should throw 404 if warehouse not found", async () => {

      (Warehouse.findOne as any).mockResolvedValue(null);

      await expect(
        warehouseService.getWarehouseById("1")
      ).rejects.toThrow("Warehouse not found");

    });

  });

  /* UPDATE WAREHOUSE */

  describe("updateWarehouse", () => {

    it("should update warehouse name and location successfully", async () => {

      const mockWarehouse = {
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

      const result = await warehouseService.updateWarehouse(
        "1", "Updated Name", "Updated Location"
      );

      expect(mockWarehouse.set).toHaveBeenCalledWith("name", "Updated Name");
      expect(mockWarehouse.set).toHaveBeenCalledWith("location", "Updated Location");
      expect(mockWarehouse.save).toHaveBeenCalled();
      expect(result).toEqual(mockWarehouse);

    });

    it("should update only name when location is not provided", async () => {

      const mockWarehouse = {
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

      await warehouseService.updateWarehouse("1", "New Name", undefined);

      expect(mockWarehouse.set).toHaveBeenCalledWith("name", "New Name");
      expect(mockWarehouse.set).not.toHaveBeenCalledWith("location", expect.anything());

    });

    it("should update only location when name is not provided", async () => {

      const mockWarehouse = {
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

      await warehouseService.updateWarehouse("1", undefined, "New Location");

      expect(mockWarehouse.set).toHaveBeenCalledWith("location", "New Location");
      expect(mockWarehouse.set).not.toHaveBeenCalledWith("name", expect.anything());

    });

    it("should throw 404 if warehouse not found", async () => {

      (Warehouse.findByPk as any).mockResolvedValue(null);

      await expect(
        warehouseService.updateWarehouse("1", "Name", "Location")
      ).rejects.toThrow("Warehouse not found");

    });

  });

  /* DEACTIVATE WAREHOUSE */

  describe("deactivateWarehouse", () => {

    it("should deactivate warehouse successfully", async () => {

      const mockWarehouse = {
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

      await warehouseService.deactivateWarehouse("1");

      expect(mockWarehouse.set).toHaveBeenCalledWith("is_active", false);
      expect(mockWarehouse.save).toHaveBeenCalled();

    });

    it("should throw 404 if warehouse not found on deactivate", async () => {

      (Warehouse.findByPk as any).mockResolvedValue(null);

      await expect(
        warehouseService.deactivateWarehouse("1")
      ).rejects.toThrow("Warehouse not found");

    });

  });

  /* ACTIVATE WAREHOUSE */

  describe("activateWarehouse", () => {

    it("should activate warehouse successfully", async () => {

      const mockWarehouse = {
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

      await warehouseService.activateWarehouse("1");

      expect(mockWarehouse.set).toHaveBeenCalledWith("is_active", true);
      expect(mockWarehouse.save).toHaveBeenCalled();

    });

    it("should throw 404 if warehouse not found on activate", async () => {

      (Warehouse.findByPk as any).mockResolvedValue(null);

      await expect(
        warehouseService.activateWarehouse("1")
      ).rejects.toThrow("Warehouse not found");

    });

  });

});