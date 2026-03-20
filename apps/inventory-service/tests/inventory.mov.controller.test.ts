/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
  createInventoryController,
  addStockController,
  deductStockController
} from "../src/controllers/inventory.movement.controller.js";

import { inventoryMovementService } from "../src/services/inventory.movement.js";

/* MOCKS */

vi.mock("../src/services/inventory.movement.js", () => ({
  inventoryMovementService: {
    createInventory: vi.fn(),
    addStock: vi.fn(),
    deductStock: vi.fn()
  }
}));

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockInventory = {
  id: "inv-1",
  product_id: "prod-1",
  warehouse_id: "wh-1",
  available_qty: 100,
  reserved_qty: 0
};

describe("Inventory Movement Controller", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE INVENTORY */

  describe("createInventoryController", () => {

    it("should return 201 with created inventory", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          availableQty: 100,
          reservedQty: 0
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.createInventory as any).mockResolvedValue(mockInventory);

      await createInventoryController(req, res);

      expect(inventoryMovementService.createInventory).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        100,
        0
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory created successfully",
        data: mockInventory
      });

    });

    it("should default reservedQty to 0 when not provided", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          availableQty: 50
          // reservedQty omitted
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.createInventory as any).mockResolvedValue(mockInventory);

      await createInventoryController(req, res);

      expect(inventoryMovementService.createInventory).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        50,
        0   // defaulted from reservedQty ?? 0
      );

    });

    it("should convert availableQty and reservedQty to numbers", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          availableQty: "200",
          reservedQty: "10"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.createInventory as any).mockResolvedValue(mockInventory);

      await createInventoryController(req, res);

      expect(inventoryMovementService.createInventory).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        200,  // number not string
        10    // number not string
      );

    });

    it("should throw when inventory already exists", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          availableQty: 100,
          reservedQty: 0
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.createInventory as any).mockRejectedValue(
        Object.assign(
          new Error("Inventory already exists for this product and warehouse"),
          { statusCode: 409 }
        )
      );

      await expect(createInventoryController(req, res)).rejects.toThrow(
        "Inventory already exists for this product and warehouse"
      );

    });

  });

  /* ADD STOCK */

  describe("addStockController", () => {

    it("should return 200 with success message", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          quantity: 20,
          referenceId: "PO-001"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.addStock as any).mockResolvedValue(undefined);

      await addStockController(req, res);

      expect(inventoryMovementService.addStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        20,
        "PO-001"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stock added successfully"
      });

    });

    it("should pass undefined referenceId when not provided", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          quantity: 10
          // referenceId omitted
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.addStock as any).mockResolvedValue(undefined);

      await addStockController(req, res);

      expect(inventoryMovementService.addStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        10,
        undefined  // referenceId ?? undefined
      );

    });

    it("should convert quantity to number", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          quantity: "15",
          referenceId: "PO-002"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.addStock as any).mockResolvedValue(undefined);

      await addStockController(req, res);

      expect(inventoryMovementService.addStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        15,   // number not string
        "PO-002"
      );

    });

    it("should throw when service throws", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          quantity: 10,
          referenceId: "PO-001"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.addStock as any).mockRejectedValue(
        new Error("DB_ERROR")
      );

      await expect(addStockController(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

  /* DEDUCT STOCK */

  describe("deductStockController", () => {

    it("should return 200 with success message", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          quantity: 5,
          referenceId: "ORDER-001"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.deductStock as any).mockResolvedValue(undefined);

      await deductStockController(req, res);

      expect(inventoryMovementService.deductStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        5,
        "ORDER-001"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stock deducted successfully"
      });

    });

    it("should convert quantity to number", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          quantity: "8",
          referenceId: "ORDER-002"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.deductStock as any).mockResolvedValue(undefined);

      await deductStockController(req, res);

      expect(inventoryMovementService.deductStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        8,    // number not string
        "ORDER-002"
      );

    });

    it("should throw when service throws INSUFFICIENT_STOCK", async () => {

      const req = {
        body: {
          productId: "prod-1",
          warehouseId: "wh-1",
          quantity: 9999,
          referenceId: "ORDER-001"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.deductStock as any).mockRejectedValue(
        Object.assign(new Error("INSUFFICIENT_STOCK"), { statusCode: 400 })
      );

      await expect(deductStockController(req, res)).rejects.toThrow("INSUFFICIENT_STOCK");

    });

    it("should throw when service throws INVENTORY_NOT_FOUND", async () => {

      const req = {
        body: {
          productId: "nonexistent",
          warehouseId: "wh-1",
          quantity: 5,
          referenceId: "ORDER-001"
        }
      } as Request;

      const res = mockResponse();

      (inventoryMovementService.deductStock as any).mockRejectedValue(
        Object.assign(new Error("INVENTORY_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(deductStockController(req, res)).rejects.toThrow("INVENTORY_NOT_FOUND");

    });

  });

});