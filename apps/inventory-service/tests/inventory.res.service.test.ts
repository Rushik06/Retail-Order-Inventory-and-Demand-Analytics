/*eslint-disable */
import { describe, it, expect, vi, beforeEach } from "vitest";

import { inventoryReservationService } from "../src/services/inventory.reservation.service.js";
import { sequelize } from "../src/config/sequilize.js";
import { findInventory,saveInventory } from "../src/repository/inventory.repository.js";

/* MOCKS */

vi.mock("../../src/config/index.js", () => ({
  sequelize: {
    transaction: vi.fn()
  }
}));

vi.mock("../../src/repository/inventory.repository.js", () => ({
  findInventory: vi.fn(),
  saveInventory: vi.fn()
}));

describe("InventoryReservationService", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* RESERVE STOCK SUCCESS */

  it("should reserve stock successfully", async () => {

    const mockInventory = {
      getDataValue: vi.fn((field) => {
        if (field === "available_qty") return 100;
        if (field === "reserved_qty") return 10;
      }),
      set: vi.fn()
    };

    (findInventory as any).mockResolvedValue(mockInventory);

    (sequelize.transaction as any).mockImplementation(async (cb:any) =>
      cb("transaction")
    );

    await inventoryReservationService.reserveStock(
      "product1",
      "warehouse1",
      20
    );

    expect(findInventory).toHaveBeenCalled();

    expect(mockInventory.set).toHaveBeenCalledWith(
      "reserved_qty",
      30
    );

    expect(saveInventory).toHaveBeenCalled();

  });

  /* INVENTORY NOT FOUND */

  it("should throw error if inventory not found", async () => {

    (findInventory as any).mockResolvedValue(null);

    (sequelize.transaction as any).mockImplementation(async () =>
      ("transaction")
    );

    await expect(
      inventoryReservationService.reserveStock(
        "p1",
        "w1",
        10
      )
    ).rejects.toThrow("Inventory not found");

  });

  /* INSUFFICIENT STOCK */

  it("should throw error if insufficient stock", async () => {

    const mockInventory = {
      getDataValue: vi.fn((field) => {
        if (field === "available_qty") return 20;
        if (field === "reserved_qty") return 15;
      }),
      set: vi.fn()
    };

    (findInventory as any).mockResolvedValue(mockInventory);

    (sequelize.transaction as any).mockImplementation(async (cb:any) =>
      cb("transaction")
    );

    await expect(
      inventoryReservationService.reserveStock(
        "p1",
        "w1",
        10
      )
    ).rejects.toThrow("Insufficient stock");

  });

  /* RELEASE STOCK SUCCESS */

  it("should release reserved stock", async () => {

    const mockInventory = {
      getDataValue: vi.fn((field) => {
        if (field === "reserved_qty") return 20;
      }),
      set: vi.fn()
    };

    (findInventory as any).mockResolvedValue(mockInventory);

    (sequelize.transaction as any).mockImplementation(async (cb:any) =>
      cb("transaction")
    );

    await inventoryReservationService.releaseStock(
      "product1",
      "warehouse1",
      10
    );

    expect(mockInventory.set).toHaveBeenCalledWith(
      "reserved_qty",
      10
    );

    expect(saveInventory).toHaveBeenCalled();

  });

  /* RELEASE MORE THAN RESERVED */

  it("should throw error if releasing more than reserved", async () => {

    const mockInventory = {
      getDataValue: vi.fn((field) => {
        if (field === "reserved_qty") return 5;
      }),
      set: vi.fn()
    };

    (findInventory as any).mockResolvedValue(mockInventory);

    (sequelize.transaction as any).mockImplementation(async (cb:any) =>
      cb("transaction")
    );

    await expect(
      inventoryReservationService.releaseStock(
        "p1",
        "w1",
        10
      )
    ).rejects.toThrow(
      "Cannot release more than reserved quantity"
    );

  });

});