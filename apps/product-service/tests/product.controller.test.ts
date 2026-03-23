/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../src/controllers/product.controller.js";

import * as service from "../src/services/product.service.js";

/* MOCKS */

vi.mock("../src/services/product.service.js", () => ({
  createProduct: vi.fn(),
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn()
}));

vi.mock("../src/validations/product.schema.js", () => ({
  createProductSchema: {
    safeParse: vi.fn()
  },
  updateProductSchema: {
    safeParse: vi.fn()
  }
}));

import {
  createProductSchema,
  updateProductSchema
} from "../src/validations/product.schema.js";

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockProduct = {
  id: "prod-1",
  name: "Laptop",
  category: "Electronics",
  price: 999,
  stock: 10,
  sku: "ELEC-00001"
};

describe("Product Controller", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE PRODUCT */

  describe("createProduct", () => {

    it("should return 201 with created product on success", async () => {

      const req = {
        body: { name: "Laptop", category: "Electronics", price: 999 }
      } as Request;

      const res = mockResponse();

      (createProductSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          body: { name: "Laptop", category: "Electronics", price: 999 }
        }
      });

      (service.createProduct as any).mockResolvedValue(mockProduct);

      await createProduct(req, res);

      expect(service.createProduct).toHaveBeenCalledWith({
        name: "Laptop",
        category: "Electronics",
        price: 999
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);

    });

    it("should return 400 when validation fails", async () => {

      const req = { body: {} } as Request;
      const res = mockResponse();

      (createProductSchema.safeParse as any).mockReturnValue({
        success: false,
        error: {
          issues: [{ message: "name is required" }]
        }
      });

      await createProduct(req, res);

      expect(service.createProduct).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "name is required" });

    });

    it("should return default message when no issues present", async () => {

      const req = { body: {} } as Request;
      const res = mockResponse();

      (createProductSchema.safeParse as any).mockReturnValue({
        success: false,
        error: { issues: [] }
      });

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Validation error" });

    });

    it("should throw when service throws", async () => {

      const req = {
        body: { name: "Laptop", category: "Electronics", price: 999 }
      } as Request;

      const res = mockResponse();

      (createProductSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          body: { name: "Laptop", category: "Electronics", price: 999 }
        }
      });

      (service.createProduct as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(createProduct(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

  /* GET PRODUCTS */

  describe("getProducts", () => {

    it("should return all products", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockProducts = [mockProduct, { ...mockProduct, id: "prod-2", name: "Phone" }];

      (service.getProducts as any).mockResolvedValue(mockProducts);

      await getProducts(req, res);

      expect(service.getProducts).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockProducts);

    });

    it("should return empty array when no products exist", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (service.getProducts as any).mockResolvedValue([]);

      await getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith([]);

    });

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (service.getProducts as any).mockRejectedValue(new Error("DB_ERROR"));

      await expect(getProducts(req, res)).rejects.toThrow("DB_ERROR");

    });

  });

  /* GET PRODUCT BY ID */

  describe("getProductById", () => {

    it("should return product when found", async () => {

      const req = { params: { id: "prod-1" } } as unknown as Request;
      const res = mockResponse();

      (service.getProductById as any).mockResolvedValue(mockProduct);

      await getProductById(req, res);

      expect(service.getProductById).toHaveBeenCalledWith("prod-1");
      expect(res.json).toHaveBeenCalledWith(mockProduct);

    });

    it("should throw when product not found", async () => {

      const req = { params: { id: "nonexistent" } } as unknown as Request;
      const res = mockResponse();

      (service.getProductById as any).mockRejectedValue(
        Object.assign(new Error("PRODUCT_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(getProductById(req, res)).rejects.toThrow("PRODUCT_NOT_FOUND");

    });

  });

  /* UPDATE PRODUCT */

  describe("updateProduct", () => {

    it("should return updated product on success", async () => {

      const req = {
        params: { id: "prod-1" },
        body: { name: "Updated Laptop", price: 1200 }
      } as unknown as Request;

      const res = mockResponse();

      const updatedProduct = { ...mockProduct, name: "Updated Laptop", price: 1200 };

      (updateProductSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          params: { id: "prod-1" },
          body: { name: "Updated Laptop", price: 1200 }
        }
      });

      (service.updateProduct as any).mockResolvedValue(updatedProduct);

      await updateProduct(req, res);

      expect(service.updateProduct).toHaveBeenCalledWith(
        "prod-1",
        { name: "Updated Laptop", price: 1200 }
      );

      expect(res.json).toHaveBeenCalledWith(updatedProduct);

    });

    it("should return 400 when validation fails", async () => {

      const req = {
        params: { id: "prod-1" },
        body: { price: -1 }
      } as unknown as Request;

      const res = mockResponse();

      (updateProductSchema.safeParse as any).mockReturnValue({
        success: false,
        error: {
          issues: [{ message: "price must be positive" }]
        }
      });

      await updateProduct(req, res);

      expect(service.updateProduct).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "price must be positive" });

    });

    it("should return default message when no issues present", async () => {

      const req = {
        params: { id: "prod-1" },
        body: {}
      } as unknown as Request;

      const res = mockResponse();

      (updateProductSchema.safeParse as any).mockReturnValue({
        success: false,
        error: { issues: [] }
      });

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Validation error" });

    });

    it("should throw when service throws", async () => {

      const req = {
        params: { id: "nonexistent" },
        body: { name: "Updated" }
      } as unknown as Request;

      const res = mockResponse();

      (updateProductSchema.safeParse as any).mockReturnValue({
        success: true,
        data: {
          params: { id: "nonexistent" },
          body: { name: "Updated" }
        }
      });

      (service.updateProduct as any).mockRejectedValue(
        Object.assign(new Error("PRODUCT_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(updateProduct(req, res)).rejects.toThrow("PRODUCT_NOT_FOUND");

    });

  });

  /* DELETE PRODUCT */

  describe("deleteProduct", () => {

    it("should return success message when deleted", async () => {

      const req = { params: { id: "prod-1" } } as unknown as Request;
      const res = mockResponse();

      (service.deleteProduct as any).mockResolvedValue(undefined);

      await deleteProduct(req, res);

      expect(service.deleteProduct).toHaveBeenCalledWith("prod-1");
      expect(res.json).toHaveBeenCalledWith({ message: "Product deleted successfully" });

    });

    it("should throw when product not found", async () => {

      const req = { params: { id: "nonexistent" } } as unknown as Request;
      const res = mockResponse();

      (service.deleteProduct as any).mockRejectedValue(
        Object.assign(new Error("PRODUCT_NOT_FOUND"), { statusCode: 404 })
      );

      await expect(deleteProduct(req, res)).rejects.toThrow("PRODUCT_NOT_FOUND");

    });

  });

});