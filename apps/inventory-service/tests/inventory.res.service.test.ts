/*eslint-disable */
import { describe, it, expect, vi, beforeEach } from "vitest";

import { inventoryReservationService } from "../src/services/inventory.reservation.service.js";
import { sequelize } from "../src/config/index.js";
import { findInventory, saveInventory } from "../src/repository/inventory.repository.js";

/* MOCKS */

vi.mock("../src/config/index.js", () => ({
  sequelize: {
    transaction: vi.fn()
  }
}));

vi.mock("../src/repository/inventory.repository.js", () => ({
  findInventory: vi.fn(),
  saveInventory: vi.fn()
}));

vi.mock("../src/constants/errors.js", () => ({
  ERRORS: {
    INVENTORY_NOT_FOUND: "Inventory not found",
    INSUFFICIENT_STOCK: "Insufficient stock"
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

describe("InventoryReservationService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* RESERVE STOCK */

  describe("reserveStock", () => {

    it("should reserve stock successfully", async () => {

      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 100;
          if (field === "reserved_qty") return 10;
        }),
        set: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(mockInventory);
      (saveInventory as any).mockResolvedValue(undefined);

      await inventoryReservationService.reserveStock(
        "product1",
        "warehouse1",
        20
      );

      expect(findInventory).toHaveBeenCalledWith(
        "product1",
        "warehouse1",
        "transaction",
        true
      );

      expect(mockInventory.set).toHaveBeenCalledWith("reserved_qty", 30);

      expect(saveInventory).toHaveBeenCalledWith(mockInventory, "transaction");

    });

    it("should throw 404 if inventory not found", async () => {

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(null);

      await expect(
        inventoryReservationService.reserveStock("p1", "w1", 10)
      ).rejects.toThrow("Inventory not found");

      expect(saveInventory).not.toHaveBeenCalled();

    });

    it("should throw 400 if insufficient stock", async () => {

      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 20;
          if (field === "reserved_qty") return 15;
        }),
        set: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(mockInventory);

      await expect(
        inventoryReservationService.reserveStock("p1", "w1", 10)
      ).rejects.toThrow("Insufficient stock");

      expect(mockInventory.set).not.toHaveBeenCalled();
      expect(saveInventory).not.toHaveBeenCalled();

    });

    it("should succeed when quantity equals exact effective available", async () => {

      // available=50, reserved=10, effective=40 — reserving exactly 40 should pass
      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 50;
          if (field === "reserved_qty") return 10;
        }),
        set: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(mockInventory);
      (saveInventory as any).mockResolvedValue(undefined);

      await expect(
        inventoryReservationService.reserveStock("p1", "w1", 40)
      ).resolves.toBeUndefined();

      expect(mockInventory.set).toHaveBeenCalledWith("reserved_qty", 50);

    });

    it("should throw when quantity exceeds effective available by 1", async () => {

      // available=50, reserved=10, effective=40 — reserving 41 should fail
      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "available_qty") return 50;
          if (field === "reserved_qty") return 10;
        }),
        set: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(mockInventory);

      await expect(
        inventoryReservationService.reserveStock("p1", "w1", 41)
      ).rejects.toThrow("Insufficient stock");

    });

  });

  /* RELEASE STOCK */

  describe("releaseStock", () => {

    it("should release reserved stock successfully", async () => {

      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "reserved_qty") return 20;
        }),
        set: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(mockInventory);
      (saveInventory as any).mockResolvedValue(undefined);

      await inventoryReservationService.releaseStock(
        "product1",
        "warehouse1",
        10
      );

      expect(findInventory).toHaveBeenCalledWith(
        "product1",
        "warehouse1",
        "transaction",
        true
      );

      expect(mockInventory.set).toHaveBeenCalledWith("reserved_qty", 10);

      expect(saveInventory).toHaveBeenCalledWith(mockInventory, "transaction");

    });

    it("should throw 404 if inventory not found on release", async () => {

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(null);

      await expect(
        inventoryReservationService.releaseStock("p1", "w1", 10)
      ).rejects.toThrow("Inventory not found");

      expect(saveInventory).not.toHaveBeenCalled();

    });

    it("should throw error if releasing more than reserved", async () => {

      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "reserved_qty") return 5;
        }),
        set: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(mockInventory);

      await expect(
        inventoryReservationService.releaseStock("p1", "w1", 10)
      ).rejects.toThrow("Cannot release more than reserved quantity");

      expect(mockInventory.set).not.toHaveBeenCalled();
      expect(saveInventory).not.toHaveBeenCalled();

    });

    it("should succeed when releasing exactly the reserved amount", async () => {

      const mockInventory = {
        getDataValue: vi.fn((field) => {
          if (field === "reserved_qty") return 15;
        }),
        set: vi.fn()
      };

      (sequelize.transaction as any).mockImplementation(async (cb: any) =>
        cb("transaction")
      );

      (findInventory as any).mockResolvedValue(mockInventory);
      (saveInventory as any).mockResolvedValue(undefined);

      await expect(
        inventoryReservationService.releaseStock("p1", "w1", 15)
      ).resolves.toBeUndefined();

      expect(mockInventory.set).toHaveBeenCalledWith("reserved_qty", 0);

    });

  });

});