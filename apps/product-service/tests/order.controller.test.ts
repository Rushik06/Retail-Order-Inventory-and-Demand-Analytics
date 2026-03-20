/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
  createOrder,
  updateOrderStatus,
  getOrders
} from "../src/controllers/order.controller.js";

import * as service from "../src/services/order.service.js";

/* MOCKS */

vi.mock("../src/services/order.service.js", () => ({
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
  getOrders: vi.fn()
}));

vi.mock("../src/validations/order.schema.js", () => ({
  createOrderSchema: {
    safeParse: vi.fn()
  },
  updateOrderStatusSchema: {
    safeParse: vi.fn()
  }
}));

import {
  createOrderSchema,
  updateOrderStatusSchema
} from "../src/validations/order.schema.js";

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("Order Controller", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE ORDER */

  describe("createOrder", () => {

    it("should return 201 with created order on success", async () => {

      const req = {
        body: {
          customerName: "John Doe",
          items: [{ productId: "prod-1", quantity: 2 }]
        }
      } as Request;

      const res = mockResponse();

      const mockOrder = { id: "order-1", customerName: "John Doe", totalAmount: 200 };

      (createOrderSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          body: {
            customerName: "John Doe",
            items: [{ productId: "prod-1", quantity: 2 }]
          }
        }
      });

      (service.createOrder as any).mockResolvedValue(mockOrder);

      await createOrder(req, res);

      expect(service.createOrder).toHaveBeenCalledWith(
        "John Doe",
        [{ productId: "prod-1", quantity: 2 }]
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockOrder);

    });

    it("should return 400 when validation fails", async () => {

      const req = {
        body: { items: [] }
      } as Request;

      const res = mockResponse();

      (createOrderSchema.safeParse as any).mockReturnValue({
        success: false,
        error: {
          issues: [{ message: "customerName is required" }]
        }
      });

      await createOrder(req, res);

      expect(service.createOrder).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "customerName is required"
      });

    });

    it("should return first validation error message when multiple issues", async () => {

      const req = { body: {} } as Request;
      const res = mockResponse();

      (createOrderSchema.safeParse as any).mockReturnValue({
        success: false,
        error: {
          issues: [
            { message: "customerName is required" },
            { message: "items is required" }
          ]
        }
      });

      await createOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "customerName is required"
      });

    });

    it("should throw when service throws", async () => {

      const req = {
        body: {
          customerName: "John",
          items: [{ productId: "p1", quantity: 1 }]
        }
      } as Request;

      const res = mockResponse();

      (createOrderSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          body: {
            customerName: "John",
            items: [{ productId: "p1", quantity: 1 }]
          }
        }
      });

      (service.createOrder as any).mockRejectedValue(
        Object.assign(new Error("INSUFFICIENT_STOCK"), { statusCode: 400 })
      );

      await expect(createOrder(req, res)).rejects.toThrow("INSUFFICIENT_STOCK");

    });

  });

  /* UPDATE ORDER STATUS */

  describe("updateOrderStatus", () => {

    it("should return updated order on success", async () => {

      const req = {
        params: { id: "order-1" },
        body: { status: "DELIVERED" }
      } as unknown as Request;

      const res = mockResponse();

      const mockOrder = { id: "order-1", status: "DELIVERED" };

      (updateOrderStatusSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          params: { id: "order-1" },
          body: { status: "DELIVERED" }
        }
      });

      (service.updateOrderStatus as any).mockResolvedValue(mockOrder);

      await updateOrderStatus(req, res);

      expect(service.updateOrderStatus).toHaveBeenCalledWith("order-1", "DELIVERED");
      expect(res.json).toHaveBeenCalledWith(mockOrder);

    });

    it("should return 400 when validation fails", async () => {

      const req = {
        params: { id: "order-1" },
        body: {}
      } as unknown as Request;

      const res = mockResponse();

      (updateOrderStatusSchema.safeParse as any).mockReturnValue({
        success: false,
        error: {
          issues: [{ message: "status is required" }]
        }
      });

      await updateOrderStatus(req, res);

      expect(service.updateOrderStatus).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "status is required" });

    });

    it("should throw when service throws", async () => {

      const req = {
        params: { id: "nonexistent" },
        body: { status: "DELIVERED" }
      } as unknown as Request;

      const res = mockResponse();

      (updateOrderStatusSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          params: { id: "nonexistent" },
          body: { status: "DELIVERED" }
        }
      });

      (service.updateOrderStatus as any).mockRejectedValue(
        Object.assign(new Error("ORDER_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(updateOrderStatus(req, res)).rejects.toThrow("ORDER_NOT_FOUND");

    });

  });

  /* GET ORDERS */

  describe("getOrders", () => {

    it("should return all orders", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockOrders = [
        { id: "order-1", status: "PENDING" },
        { id: "order-2", status: "DELIVERED" }
      ];

      (service.getOrders as any).mockResolvedValue(mockOrders);

      await getOrders(req, res);

      expect(service.getOrders).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockOrders);

    });

    it("should return empty array when no orders exist", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (service.getOrders as any).mockResolvedValue([]);

      await getOrders(req, res);

      expect(res.json).toHaveBeenCalledWith([]);

    });

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (service.getOrders as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(getOrders(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

});