/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { inventoryMovementService } from "../src/services/inventory.movement.js";
import { sequelize } from "../src/config/index.js";
import { Inventory } from "../src/models/inventory.model.js";
import { InventoryLog } from "../src/models/inventorylog.model.js";

/* MOCKS */

vi.mock("../src/config/index.js", () => ({
  sequelize: {
    transaction: vi.fn()
  }
}));

vi.mock("../src/models/inventory.model.js", () => ({
  Inventory: {
    findOne: vi.fn(),
    create: vi.fn(),
    findOrCreate: vi.fn()
  }
}));

vi.mock("../src/models/inventorylog.model.js", () => ({
  InventoryLog: {
    create: vi.fn()
  }
}));

vi.mock("../src/services/inventory.alert.js", () => ({
  inventoryAlertService: {
    checkLowStock: vi.fn().mockResolvedValue(undefined)
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

describe("InventoryMovementService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE INVENTORY */

  describe("createInventory", () => {

    it("should create inventory successfully", async () => {

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOne as any).mockResolvedValue(null);

      const mockInventory = { id: "1" };

      (Inventory.create as any).mockResolvedValue(mockInventory);
      (InventoryLog.create as any).mockResolvedValue(undefined);

      const result = await inventoryMovementService.createInventory(
        "p1",
        "w1",
        100
      );

      expect(Inventory.findOne).toHaveBeenCalled();

      expect(Inventory.create).toHaveBeenCalledWith(
        {
          product_id: "p1",
          warehouse_id: "w1",
          available_qty: 100,
          reserved_qty: 0
        },
        expect.objectContaining({ transaction: expect.anything() })
      );

      expect(InventoryLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          product_id: "p1",
          warehouse_id: "w1",
          action_type: "CREATE",
          previous_available_qty: 0,
          new_available_qty: 100
        }),
        expect.objectContaining({ transaction: expect.anything() })
      );

      expect(result).toEqual(mockInventory);

    });

    it("should use default reservedQty of 0 when not provided", async () => {

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOne as any).mockResolvedValue(null);
      (Inventory.create as any).mockResolvedValue({ id: "1" });
      (InventoryLog.create as any).mockResolvedValue(undefined);

      await inventoryMovementService.createInventory("p1", "w1", 50);

      expect(Inventory.create).toHaveBeenCalledWith(
        expect.objectContaining({ reserved_qty: 0 }),
        expect.anything()
      );

    });

    it("should throw 409 error if inventory already exists", async () => {

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOne as any).mockResolvedValue({ id: "existing" });

      await expect(
        inventoryMovementService.createInventory("p1", "w1", 50)
      ).rejects.toThrow(
        "Inventory already exists for this product and warehouse"
      );

      expect(Inventory.create).not.toHaveBeenCalled();
      expect(InventoryLog.create).not.toHaveBeenCalled();

    });

  });

  /* ADD STOCK */

  describe("addStock", () => {

    it("should add stock successfully", async () => {

      const mockInventory = {
        getDataValue: vi.fn(() => 100),
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);
      (InventoryLog.create as any).mockResolvedValue(undefined);

      await inventoryMovementService.addStock("p1", "w1", 20, "ref1");

      expect(mockInventory.set).toHaveBeenCalledWith("available_qty", 120);

      expect(mockInventory.save).toHaveBeenCalled();

      expect(InventoryLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          product_id: "p1",
          warehouse_id: "w1",
          action_type: "INBOUND",
          previous_available_qty: 100,
          new_available_qty: 120,
          reference_id: "ref1"
        }),
        expect.objectContaining({ transaction: expect.anything() })
      );

    });

    it("should use null referenceId when not provided", async () => {

      const mockInventory = {
        getDataValue: vi.fn(() => 50),
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);
      (InventoryLog.create as any).mockResolvedValue(undefined);

      await inventoryMovementService.addStock("p1", "w1", 10);

      expect(InventoryLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ reference_id: null }),
        expect.anything()
      );

    });

  });

  /* DEDUCT STOCK */

  describe("deductStock", () => {

    it("should deduct stock successfully", async () => {

      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 100;
          if (field === "reserved_qty") return 10;
        }),
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);
      (InventoryLog.create as any).mockResolvedValue(undefined);

      await inventoryMovementService.deductStock("p1", "w1", 20, "order123");

      expect(mockInventory.set).toHaveBeenCalledWith("available_qty", 80);

      expect(mockInventory.save).toHaveBeenCalled();

      expect(InventoryLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          product_id: "p1",
          warehouse_id: "w1",
          action_type: "OUTBOUND",
          previous_available_qty: 100,
          new_available_qty: 80,
          reference_id: "order123"
        }),
        expect.objectContaining({ transaction: expect.anything() })
      );

    });

    it("should throw 400 error if insufficient stock", async () => {

      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 20;
          if (field === "reserved_qty") return 15;
        }),
        set: vi.fn(),
        save: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);

      await expect(
        inventoryMovementService.deductStock("p1", "w1", 10, "order123")
      ).rejects.toThrow("Insufficient stock");

      expect(mockInventory.set).not.toHaveBeenCalled();
      expect(mockInventory.save).not.toHaveBeenCalled();
      expect(InventoryLog.create).not.toHaveBeenCalled();

    });

    it("should throw when deduct quantity exactly equals effective available", async () => {

      // available=50, reserved=10, effective=40 — deducting exactly 40 should succeed
      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 50;
          if (field === "reserved_qty") return 10;
        }),
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined)
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);
      (InventoryLog.create as any).mockResolvedValue(undefined);

      await expect(
        inventoryMovementService.deductStock("p1", "w1", 40, "order123")
      ).resolves.toBeUndefined();

      expect(mockInventory.set).toHaveBeenCalledWith("available_qty", 10);

    });

    it("should throw when deduct quantity exceeds effective available by 1", async () => {

      // available=50, reserved=10, effective=40 — deducting 41 should fail
      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 50;
          if (field === "reserved_qty") return 10;
        }),
        set: vi.fn(),
        save: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb({ LOCK: { UPDATE: true } })
      );

      (Inventory.findOrCreate as any).mockResolvedValue([mockInventory]);

      await expect(
        inventoryMovementService.deductStock("p1", "w1", 41, "order123")
      ).rejects.toThrow("Insufficient stock");

    });

  });

});