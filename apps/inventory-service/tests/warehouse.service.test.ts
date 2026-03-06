/*eslint-disable */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { warehouseService } from "../src/services/warehouse.service.js";
import { Warehouse } from "../src/models/warehouse.model.js"; 

vi.mock("../../src/models/warehouse.model", () => ({
  Warehouse: {
    findOne: vi.fn(),
    findAndCountAll: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
  }
}));

describe("WarehouseService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE WAREHOUSE */

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

    expect(Warehouse.findOne).toHaveBeenCalled();
    expect(Warehouse.create).toHaveBeenCalled();

    expect(result).toEqual(createdWarehouse);

  });

  it("should throw error if warehouse already exists", async () => {

    (Warehouse.findOne as any).mockResolvedValue({ id: "1" });

    await expect(
      warehouseService.createWarehouse("Delhi", "Delhi")
    ).rejects.toThrow("Warehouse already exists in this location");

  });

  /* GET ALL WAREHOUSES */

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
      1,
      10,
      "",
      "createdAt",
      "DESC"
    );

    expect(Warehouse.findAndCountAll).toHaveBeenCalled();

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);

  });

  /* GET WAREHOUSE BY ID */

  it("should return warehouse by id", async () => {

    const warehouse = { warehouse_id: "1", name: "Delhi" };

    (Warehouse.findOne as any).mockResolvedValue(warehouse);

    const result = await warehouseService.getWarehouseById("1");

    expect(result).toEqual(warehouse);

  });

  it("should throw error if warehouse not found", async () => {

    (Warehouse.findOne as any).mockResolvedValue(null);

    await expect(
      warehouseService.getWarehouseById("1")
    ).rejects.toThrow("Warehouse not found");

  });

  /* UPDATE WAREHOUSE */

  it("should update warehouse successfully", async () => {

    const mockWarehouse = {
      set: vi.fn(),
      save: vi.fn()
    };

    (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

    const result = await warehouseService.updateWarehouse(
      "1",
      "Updated Name",
      "Updated Location"
    );

    expect(mockWarehouse.set).toHaveBeenCalledWith("name", "Updated Name");
    expect(mockWarehouse.set).toHaveBeenCalledWith("location", "Updated Location");

    expect(mockWarehouse.save).toHaveBeenCalled();

    expect(result).toEqual(mockWarehouse);

  });

  it("should throw error if warehouse not found while updating", async () => {

    (Warehouse.findByPk as any).mockResolvedValue(null);

    await expect(
      warehouseService.updateWarehouse("1", "Name", "Location")
    ).rejects.toThrow("Warehouse not found");

  });

  /* DEACTIVATE WAREHOUSE */

  it("should deactivate warehouse", async () => {

    const mockWarehouse = {
      set: vi.fn(),
      save: vi.fn()
    };

    (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

    await warehouseService.deactivateWarehouse("1");

    expect(mockWarehouse.set).toHaveBeenCalledWith("is_active", false);
    expect(mockWarehouse.save).toHaveBeenCalled();

  });

  /* ACTIVATE WAREHOUSE */

  it("should activate warehouse", async () => {

    const mockWarehouse = {
      set: vi.fn(),
      save: vi.fn()
    };

    (Warehouse.findByPk as any).mockResolvedValue(mockWarehouse);

    await warehouseService.activateWarehouse("1");

    expect(mockWarehouse.set).toHaveBeenCalledWith("is_active", true);
    expect(mockWarehouse.save).toHaveBeenCalled();

  });

});