/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
  createWarehouseController,
  getAllWarehousesController,
  getWarehouseByIdController,
  updateWarehouseController,
  deactivateWarehouseController,
  activateWarehouseController
} from "../src/controllers/warehouse.controller.js";

import { warehouseService } from "../src/services/warehouse.service.js";

/* MOCKS */

vi.mock("../src/services/warehouse.service.js", () => ({
  warehouseService: {
    createWarehouse: vi.fn(),
    getAllWarehouses: vi.fn(),
    getWarehouseById: vi.fn(),
    updateWarehouse: vi.fn(),
    deactivateWarehouse: vi.fn(),
    activateWarehouse: vi.fn()
  }
}));

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockWarehouse = {
  warehouse_id: "wh-1",
  name: "Delhi Warehouse",
  location: "Delhi",
  is_active: true
};

describe("Warehouse Controller", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE WAREHOUSE */

  describe("createWarehouseController", () => {

    it("should return 201 with created warehouse", async () => {

      const req = {
        body: { name: "Delhi Warehouse", location: "Delhi" }
      } as Request;

      const res = mockResponse();

      (warehouseService.createWarehouse as any).mockResolvedValue(mockWarehouse);

      await createWarehouseController(req, res);

      expect(warehouseService.createWarehouse).toHaveBeenCalledWith(
        "Delhi Warehouse",
        "Delhi"
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Warehouse created successfully",
        data: mockWarehouse
      });

    });

    it("should throw when service throws", async () => {

      const req = {
        body: { name: "Delhi Warehouse", location: "Delhi" }
      } as Request;

      const res = mockResponse();

      (warehouseService.createWarehouse as any).mockRejectedValue(
        Object.assign(new Error("Warehouse already exists in this location"), { statusCode: 409 })
      );

      await expect(createWarehouseController(req, res)).rejects.toThrow(
        "Warehouse already exists in this location"
      );

    });

  });

  /* GET ALL WAREHOUSES */

  describe("getAllWarehousesController", () => {

    it("should return 200 with paginated warehouses using default params", async () => {

      const req = { query: {} } as Request;
      const res = mockResponse();

      const mockResult = {
        data: [mockWarehouse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      };

      (warehouseService.getAllWarehouses as any).mockResolvedValue(mockResult);

      await getAllWarehousesController(req, res);

      expect(warehouseService.getAllWarehouses).toHaveBeenCalledWith(
        1, 10, "", "createdAt", "DESC"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);

    });

    it("should parse query params and pass them to service", async () => {

      const req = {
        query: {
          page: "2",
          limit: "5",
          search: "Delhi",
          sortField: "name",
          sortOrder: "ASC"
        }
      } as unknown as Request;

      const res = mockResponse();

      (warehouseService.getAllWarehouses as any).mockResolvedValue({
        data: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0
      });

      await getAllWarehousesController(req, res);

      expect(warehouseService.getAllWarehouses).toHaveBeenCalledWith(
        2, 5, "Delhi", "name", "ASC"
      );

    });

    it("should throw when service throws", async () => {

      const req = { query: {} } as Request;
      const res = mockResponse();

      (warehouseService.getAllWarehouses as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(getAllWarehousesController(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

  /* GET WAREHOUSE BY ID */

  describe("getWarehouseByIdController", () => {

    it("should return 200 with warehouse data", async () => {

      const req = { params: { id: "wh-1" } } as unknown as Request;
      const res = mockResponse();

      (warehouseService.getWarehouseById as any).mockResolvedValue(mockWarehouse);

      await getWarehouseByIdController(req, res);

      expect(warehouseService.getWarehouseById).toHaveBeenCalledWith("wh-1");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockWarehouse });

    });

    it("should throw when warehouse not found", async () => {

      const req = { params: { id: "nonexistent" } } as unknown as Request;
      const res = mockResponse();

      (warehouseService.getWarehouseById as any).mockRejectedValue(
        Object.assign(new Error("Warehouse not found"), { statusCode: 404 })
      );

      await expect(getWarehouseByIdController(req, res)).rejects.toThrow(
        "Warehouse not found"
      );

    });

  });

  /* UPDATE WAREHOUSE */

  describe("updateWarehouseController", () => {

    it("should return 200 with updated warehouse", async () => {

      const req = {
        params: { id: "wh-1" },
        body: { name: "Updated Name", location: "Mumbai" }
      } as unknown as Request;

      const res = mockResponse();

      const updatedWarehouse = { ...mockWarehouse, name: "Updated Name", location: "Mumbai" };

      (warehouseService.updateWarehouse as any).mockResolvedValue(updatedWarehouse);

      await updateWarehouseController(req, res);

      expect(warehouseService.updateWarehouse).toHaveBeenCalledWith(
        "wh-1",
        "Updated Name",
        "Mumbai"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Warehouse updated successfully",
        data: updatedWarehouse
      });

    });

    it("should throw when warehouse not found", async () => {

      const req = {
        params: { id: "nonexistent" },
        body: { name: "Name", location: "Location" }
      } as unknown as Request;

      const res = mockResponse();

      (warehouseService.updateWarehouse as any).mockRejectedValue(
        Object.assign(new Error("Warehouse not found"), { statusCode: 404 })
      );

      await expect(updateWarehouseController(req, res)).rejects.toThrow(
        "Warehouse not found"
      );

    });

  });

  /* DEACTIVATE WAREHOUSE */

  describe("deactivateWarehouseController", () => {

    it("should return 200 with deactivated message", async () => {

      const req = { params: { id: "wh-1" } } as unknown as Request;
      const res = mockResponse();

      (warehouseService.deactivateWarehouse as any).mockResolvedValue(undefined);

      await deactivateWarehouseController(req, res);

      expect(warehouseService.deactivateWarehouse).toHaveBeenCalledWith("wh-1");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Warehouse deactivated successfully"
      });

    });

    it("should throw when warehouse not found", async () => {

      const req = { params: { id: "nonexistent" } } as unknown as Request;
      const res = mockResponse();

      (warehouseService.deactivateWarehouse as any).mockRejectedValue(
        Object.assign(new Error("Warehouse not found"), { statusCode: 404 })
      );

      await expect(deactivateWarehouseController(req, res)).rejects.toThrow(
        "Warehouse not found"
      );

    });

  });

  /* ACTIVATE WAREHOUSE */

  describe("activateWarehouseController", () => {

    it("should return 200 with activated message", async () => {

      const req = { params: { id: "wh-1" } } as unknown as Request;
      const res = mockResponse();

      (warehouseService.activateWarehouse as any).mockResolvedValue(undefined);

      await activateWarehouseController(req, res);

      expect(warehouseService.activateWarehouse).toHaveBeenCalledWith("wh-1");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Warehouse activated successfully"
      });

    });

    it("should throw when warehouse not found", async () => {

      const req = { params: { id: "nonexistent" } } as unknown as Request;
      const res = mockResponse();

      (warehouseService.activateWarehouse as any).mockRejectedValue(
        Object.assign(new Error("Warehouse not found"), { statusCode: 404 })
      );

      await expect(activateWarehouseController(req, res)).rejects.toThrow(
        "Warehouse not found"
      );

    });

  });

});