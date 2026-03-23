/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById
} from "../src/services/product.service.js";

import { Product } from "../src/models/product.model.js";

/* MOCKS */

vi.mock("../src/models/product.model.js", () => ({
  Product: {
    count: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    findByPk: vi.fn()
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

vi.mock("../src/constants/errors.js", () => ({
  ERRORS: {
    PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND"
  }
}));

vi.mock("crypto", () => ({
  randomUUID: vi.fn(() => "mock-uuid-1234")
}));

/* MOCK DATA */

const mockProduct = {
  id: "mock-uuid-1234",
  name: "Laptop",
  category: "Electronics",
  sku: "ELEC-00001",
  price: 999,
  update: vi.fn(),
  destroy: vi.fn()
};

describe("Product Repository", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE PRODUCT */

  describe("createProduct", () => {

    it("should create product with generated SKU from category", async () => {

      (Product.count as any).mockResolvedValue(0);
      (Product.create as any).mockResolvedValue(mockProduct);

      const result = await createProduct({
        name: "Laptop",
        category: "Electronics",
        price: 999
      } as any);

      expect(Product.count).toHaveBeenCalled();

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "mock-uuid-1234",
          name: "Laptop",
          category: "Electronics",
          sku: "ELEC-00001"
        })
      );

      expect(result).toEqual(mockProduct);

    });

    it("should pad SKU count correctly when count is greater than 0", async () => {

      (Product.count as any).mockResolvedValue(4);
      (Product.create as any).mockResolvedValue(mockProduct);

      await createProduct({
        name: "Phone",
        category: "Electronics",
        price: 499
      } as any);

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({ sku: "ELEC-00005" })
      );

    });

    it("should use PROD as SKU prefix when category is not provided", async () => {

      (Product.count as any).mockResolvedValue(0);
      (Product.create as any).mockResolvedValue(mockProduct);

      await createProduct({
        name: "Generic Item",
        price: 10
      } as any);

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({ sku: "PROD-00001" })
      );

    });

    it("should use first 4 chars of category for SKU prefix", async () => {

      (Product.count as any).mockResolvedValue(2);
      (Product.create as any).mockResolvedValue(mockProduct);

      await createProduct({
        name: "Chair",
        category: "Furniture",
        price: 200
      } as any);

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({ sku: "FURN-00003" })
      );

    });

    it("should include randomUUID as id", async () => {

      (Product.count as any).mockResolvedValue(0);
      (Product.create as any).mockResolvedValue(mockProduct);

      await createProduct({ name: "Tablet", category: "Tech", price: 300 } as any);

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({ id: "mock-uuid-1234" })
      );

    });

  });

  /* GET ALL PRODUCTS */

  describe("getProducts", () => {

    it("should return all products ordered by createdAt DESC", async () => {

      const mockList = [mockProduct, { ...mockProduct, id: "2", name: "Phone" }];

      (Product.findAll as any).mockResolvedValue(mockList);

      const result = await getProducts();

      expect(Product.findAll).toHaveBeenCalledWith({
        order: [["createdAt", "DESC"]]
      });

      expect(result).toEqual(mockList);
      expect(result).toHaveLength(2);

    });

    it("should return empty array when no products exist", async () => {

      (Product.findAll as any).mockResolvedValue([]);

      const result = await getProducts();

      expect(result).toEqual([]);

    });

  });

  /* GET PRODUCT BY ID */

  describe("getProductById", () => {

    it("should return product when found", async () => {

      (Product.findByPk as any).mockResolvedValue(mockProduct);

      const result = await getProductById("mock-uuid-1234");

      expect(Product.findByPk).toHaveBeenCalledWith("mock-uuid-1234");
      expect(result).toEqual(mockProduct);

    });

    it("should throw PRODUCT_NOT_FOUND when product does not exist", async () => {

      (Product.findByPk as any).mockResolvedValue(null);

      await expect(getProductById("nonexistent-id")).rejects.toThrow("PRODUCT_NOT_FOUND");

      expect(Product.findByPk).toHaveBeenCalledWith("nonexistent-id");

    });

  });

  /* UPDATE PRODUCT */

  describe("updateProduct", () => {

    it("should update and return updated product", async () => {

      const updatedProduct = { ...mockProduct, name: "Gaming Laptop" };

      (Product.findByPk as any).mockResolvedValue({
        ...mockProduct,
        update: vi.fn().mockResolvedValue(updatedProduct)
      });

      const result = await updateProduct("mock-uuid-1234", { name: "Gaming Laptop" } as any);

      expect(Product.findByPk).toHaveBeenCalledWith("mock-uuid-1234");
      expect(result).toEqual(updatedProduct);

    });

    it("should call update with correct data", async () => {

      const mockUpdate = vi.fn().mockResolvedValue(mockProduct);

      (Product.findByPk as any).mockResolvedValue({
        ...mockProduct,
        update: mockUpdate
      });

      await updateProduct("mock-uuid-1234", { name: "New Name", price: 1200 } as any);

      expect(mockUpdate).toHaveBeenCalledWith({ name: "New Name", price: 1200 });

    });

    it("should throw PRODUCT_NOT_FOUND when product does not exist", async () => {

      (Product.findByPk as any).mockResolvedValue(null);

      await expect(
        updateProduct("nonexistent-id", { name: "Updated" } as any)
      ).rejects.toThrow("PRODUCT_NOT_FOUND");

      expect(Product.findByPk).toHaveBeenCalledWith("nonexistent-id");

    });

  });

  /* DELETE PRODUCT */

  describe("deleteProduct", () => {

    it("should delete product successfully", async () => {

      const mockDestroy = vi.fn().mockResolvedValue(undefined);

      (Product.findByPk as any).mockResolvedValue({
        ...mockProduct,
        destroy: mockDestroy
      });

      await deleteProduct("mock-uuid-1234");

      expect(Product.findByPk).toHaveBeenCalledWith("mock-uuid-1234");
      expect(mockDestroy).toHaveBeenCalled();

    });

    it("should throw PRODUCT_NOT_FOUND when product does not exist", async () => {

      (Product.findByPk as any).mockResolvedValue(null);

      await expect(deleteProduct("nonexistent-id")).rejects.toThrow("PRODUCT_NOT_FOUND");

      expect(Product.findByPk).toHaveBeenCalledWith("nonexistent-id");

    });

  });

});