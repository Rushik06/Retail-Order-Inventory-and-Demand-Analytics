/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
  reserveStockController,
  releaseStockController
} from "../src/controllers/inventory.reservation.controller.js";

import { inventoryReservationService } from "../src/services/inventory.reservation.service.js";

/* MOCKS */

vi.mock("../src/services/inventory.reservation.service.js", () => ({
  inventoryReservationService: {
    reserveStock: vi.fn(),
    releaseStock: vi.fn()
  }
}));

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("Inventory Reservation Controller", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* RESERVE STOCK */

  describe("reserveStockController", () => {

    it("should return 200 with success message", async () => {

      const req = {
        body: { productId: "prod-1", warehouseId: "wh-1", quantity: 5 }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.reserveStock as any).mockResolvedValue(undefined);

      await reserveStockController(req, res);

      expect(inventoryReservationService.reserveStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        5
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stock reserved successfully"
      });

    });

    it("should convert quantity to number before calling service", async () => {

      const req = {
        body: { productId: "prod-1", warehouseId: "wh-1", quantity: "10" }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.reserveStock as any).mockResolvedValue(undefined);

      await reserveStockController(req, res);

      expect(inventoryReservationService.reserveStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        10   // number, not string
      );

    });

    it("should throw when service throws INVENTORY_NOT_FOUND", async () => {

      const req = {
        body: { productId: "nonexistent", warehouseId: "wh-1", quantity: 5 }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.reserveStock as any).mockRejectedValue(
        Object.assign(new Error("INVENTORY_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(reserveStockController(req, res)).rejects.toThrow(
        "INVENTORY_NOT_FOUND"
      );

    });

    it("should throw when service throws INSUFFICIENT_STOCK", async () => {

      const req = {
        body: { productId: "prod-1", warehouseId: "wh-1", quantity: 9999 }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.reserveStock as any).mockRejectedValue(
        Object.assign(new Error("INSUFFICIENT_STOCK"), { statusCode: 400 })
      );

      await expect(reserveStockController(req, res)).rejects.toThrow(
        "INSUFFICIENT_STOCK"
      );

    });

  });

  /* RELEASE STOCK */

  describe("releaseStockController", () => {

    it("should return 200 with success message", async () => {

      const req = {
        body: { productId: "prod-1", warehouseId: "wh-1", quantity: 3 }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.releaseStock as any).mockResolvedValue(undefined);

      await releaseStockController(req, res);

      expect(inventoryReservationService.releaseStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        3
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stock released successfully"
      });

    });

    it("should convert quantity to number before calling service", async () => {

      const req = {
        body: { productId: "prod-1", warehouseId: "wh-1", quantity: "7" }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.releaseStock as any).mockResolvedValue(undefined);

      await releaseStockController(req, res);

      expect(inventoryReservationService.releaseStock).toHaveBeenCalledWith(
        "prod-1",
        "wh-1",
        7   // number, not string
      );

    });

    it("should throw when service throws INVENTORY_NOT_FOUND", async () => {

      const req = {
        body: { productId: "nonexistent", warehouseId: "wh-1", quantity: 3 }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.releaseStock as any).mockRejectedValue(
        Object.assign(new Error("INVENTORY_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(releaseStockController(req, res)).rejects.toThrow(
        "INVENTORY_NOT_FOUND"
      );

    });

    it("should throw when releasing more than reserved", async () => {

      const req = {
        body: { productId: "prod-1", warehouseId: "wh-1", quantity: 999 }
      } as Request;

      const res = mockResponse();

      (inventoryReservationService.releaseStock as any).mockRejectedValue(
        Object.assign(
          new Error("Cannot release more than reserved quantity"),
          { statusCode: 400 }
        )
      );

      await expect(releaseStockController(req, res)).rejects.toThrow(
        "Cannot release more than reserved quantity"
      );

    });

  });

});