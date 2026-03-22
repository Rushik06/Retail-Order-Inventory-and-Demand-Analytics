// @vitest-environment jsdom
/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/api/product-axios", () => ({
  createProduct: vi.fn(),
  getProducts: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn()
}));

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createOrder,
  updateOrderStatus
} from "../src/api/product-axios.js";

import {
  createNewProduct,
  fetchProducts,
  updateExistingProduct,
  removeProduct,
  createNewOrder,
  changeOrderStatus
} from "../src/app/product.logic.js";

describe("Product Actions", () => {

  beforeEach(() => {
    (createProduct as any).mockClear();
    (getProducts as any).mockClear();
    (updateProduct as any).mockClear();
    (deleteProduct as any).mockClear();
    (createOrder as any).mockClear();
    (updateOrderStatus as any).mockClear();
  });

  /* PRODUCT */

  describe("createNewProduct", () => {

    it("calls createProduct with correct args and returns data", async () => {
      const mockData = { id: "1", name: "Laptop", sku: "LAP-001" };
      (createProduct as any).mockResolvedValue({ data: mockData });

      const result = await createNewProduct("Laptop", "LAP-001", "Electronics", 999, 50);

      expect(createProduct).toHaveBeenCalledWith({
        name: "Laptop",
        sku: "LAP-001",
        category: "Electronics",
        price: 999,
        stock: 50
      });
      expect(result).toEqual(mockData);
    });

    it("throws when API fails", async () => {
      (createProduct as any).mockRejectedValue(new Error("DB_ERROR"));
      await expect(createNewProduct("Laptop", "LAP-001", "Electronics", 999, 50)).rejects.toThrow("DB_ERROR");
    });

  });

  describe("fetchProducts", () => {

    it("calls getProducts and returns data", async () => {
      const mockData = [{ id: "1", name: "Laptop" }];
      (getProducts as any).mockResolvedValue({ data: mockData });

      const result = await fetchProducts();

      expect(getProducts).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

  });

  describe("updateExistingProduct", () => {

    it("calls updateProduct with id and data, returns data", async () => {
      const mockData = { id: "1", name: "Gaming Laptop", price: 1200 };
      (updateProduct as any).mockResolvedValue({ data: mockData });

      const result = await updateExistingProduct("1", { name: "Gaming Laptop", price: 1200 });

      expect(updateProduct).toHaveBeenCalledWith("1", { name: "Gaming Laptop", price: 1200 });
      expect(result).toEqual(mockData);
    });

    it("calls updateProduct with partial data", async () => {
      (updateProduct as any).mockResolvedValue({ data: {} });

      await updateExistingProduct("1", { price: 899 });

      expect(updateProduct).toHaveBeenCalledWith("1", { price: 899 });
    });

  });

  describe("removeProduct", () => {

    it("calls deleteProduct with id and returns data", async () => {
      (deleteProduct as any).mockResolvedValue({ data: { message: "Deleted" } });

      const result = await removeProduct("prod-1");

      expect(deleteProduct).toHaveBeenCalledWith("prod-1");
      expect(result).toEqual({ message: "Deleted" });
    });

    it("throws when product not found", async () => {
      (deleteProduct as any).mockRejectedValue(new Error("PRODUCT_NOT_FOUND"));
      await expect(removeProduct("nonexistent")).rejects.toThrow("PRODUCT_NOT_FOUND");
    });

  });

  /* ORDER */

  describe("createNewOrder", () => {

    it("calls createOrder with customerName and items, returns data", async () => {
      const mockData = { id: "order-1", status: "PENDING" };
      (createOrder as any).mockResolvedValue({ data: mockData });

      const items = [{ productId: "prod-1", quantity: 2 }];
      const result = await createNewOrder("John Doe", items);

      expect(createOrder).toHaveBeenCalledWith({
        customerName: "John Doe",
        items
      });
      expect(result).toEqual(mockData);
    });

    it("calls createOrder with multiple items", async () => {
      (createOrder as any).mockResolvedValue({ data: {} });

      const items = [
        { productId: "prod-1", quantity: 1 },
        { productId: "prod-2", quantity: 3 }
      ];

      await createNewOrder("Jane", items);

      expect(createOrder).toHaveBeenCalledWith({ customerName: "Jane", items });
    });

  });

  describe("changeOrderStatus", () => {

    it("calls updateOrderStatus with id and status, returns data", async () => {
      const mockData = { id: "order-1", status: "DELIVERED" };
      (updateOrderStatus as any).mockResolvedValue({ data: mockData });

      const result = await changeOrderStatus("order-1", "DELIVERED");

      expect(updateOrderStatus).toHaveBeenCalledWith("order-1", "DELIVERED");
      expect(result).toEqual(mockData);
    });

    it("calls updateOrderStatus with CANCELLED status", async () => {
      (updateOrderStatus as any).mockResolvedValue({ data: { id: "order-1", status: "CANCELLED" } });

      await changeOrderStatus("order-1", "CANCELLED");

      expect(updateOrderStatus).toHaveBeenCalledWith("order-1", "CANCELLED");
    });

  });

});