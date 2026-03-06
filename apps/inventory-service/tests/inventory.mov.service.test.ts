/*eslint-disable*/ 
import { describe, it, expect, vi, beforeEach } from "vitest";
import { inventoryMovementService } from "../src/services/inventory.movement.js";
import { sequelize } from "../src/config/index.js";
import { Inventory } from "../src/models/inventory.model.js";
import { InventoryLog } from "../src/models/inventorylog.model.js";

/* MOCKS */

vi.mock("../../src/config/index.js", () => ({
  sequelize: {
    transaction: vi.fn()
  }
}));

vi.mock("../../src/models/inventory.model.js", () => ({
  Inventory: {
    findOne: vi.fn(),
    create: vi.fn(),
    findOrCreate: vi.fn()
  }
}));

vi.mock("../../src/models/inventorylog.model.js", () => ({
  InventoryLog: {
    create: vi.fn()
  }
}));

describe("InventoryMovementService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE INVENTORY SUCCESS */

  it("should create inventory successfully", async () => {

    (sequelize.transaction as any).mockImplementation(async (cb:any) => cb({ LOCK: { UPDATE: true } }));

    (Inventory.findOne as any).mockResolvedValue(null);

    const mockInventory = { id: "1" };

    (Inventory.create as any).mockResolvedValue(mockInventory);

    const result = await inventoryMovementService.createInventory(
      "p1",
      "w1",
      100
    );

    expect(Inventory.create).toHaveBeenCalled();

    expect(InventoryLog.create).toHaveBeenCalled();

    expect(result).toEqual(mockInventory);

  });

  /* CREATE INVENTORY ALREADY EXISTS */

  it("should throw error if inventory already exists", async () => {

    (sequelize.transaction as any).mockImplementation(async (cb:any) => cb({ LOCK: { UPDATE: true } }));

    (Inventory.findOne as any).mockResolvedValue({ id: "existing" });

    await expect(
      inventoryMovementService.createInventory("p1", "w1", 50)
    ).rejects.toThrow(
      "Inventory already exists for this product and warehouse"
    );

  });

  /* ADD STOCK */

  it("should add stock successfully", async () => {

    const mockInventory = {
      getDataValue: vi.fn(() => 100),
      set: vi.fn(),
      save: vi.fn()
    };

    (sequelize.transaction as any).mockImplementation(async (cb:any) => cb({ LOCK: { UPDATE: true } }));

    (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);

    await inventoryMovementService.addStock(
      "p1",
      "w1",
      20,
      "ref1"
    );

    expect(mockInventory.set).toHaveBeenCalledWith(
      "available_qty",
      120
    );

    expect(mockInventory.save).toHaveBeenCalled();

    expect(InventoryLog.create).toHaveBeenCalled();

  });

  /* DEDUCT STOCK SUCCESS */

  it("should deduct stock successfully", async () => {

    const mockInventory = {
      getDataValue: vi.fn((field) => {
        if (field === "available_qty") return 100;
        if (field === "reserved_qty") return 10;
      }),
      set: vi.fn(),
      save: vi.fn()
    };

    (sequelize.transaction as any).mockImplementation(async (cb:any) => cb({ LOCK: { UPDATE: true } }));

    (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);

    await inventoryMovementService.deductStock(
      "p1",
      "w1",
      20,
      "order123"
    );

    expect(mockInventory.set).toHaveBeenCalledWith(
      "available_qty",
      80
    );

    expect(mockInventory.save).toHaveBeenCalled();

    expect(InventoryLog.create).toHaveBeenCalled();

  });

  /* DEDUCT STOCK INSUFFICIENT */

  it("should throw error if insufficient stock", async () => {

    const mockInventory = {
      getDataValue: vi.fn((field) => {
        if (field === "available_qty") return 20;
        if (field === "reserved_qty") return 15;
      }),
      set: vi.fn(),
      save: vi.fn()
    };

    (sequelize.transaction as any).mockImplementation(async (cb:any) => cb({ LOCK: { UPDATE: true } }));

    (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);

    await expect(
      inventoryMovementService.deductStock(
        "p1",
        "w1",
        10,
        "order123"
      )
    ).rejects.toThrow("Insufficient stock");

  });

});