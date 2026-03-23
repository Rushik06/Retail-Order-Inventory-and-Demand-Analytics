/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn()
}));

vi.mock("../src/api/api-client", () => ({
  createApiClient: vi.fn(() => mockAxios)
}));

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createOrder,
  updateOrderStatus,
  getOrders
} from "../src/api/product-axios.js";

describe("Product API", () => {

  beforeEach(() => {
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();
    mockAxios.patch.mockClear();
    mockAxios.delete.mockClear();
  });

  /* PRODUCT */

  describe("createProduct", () => {

    it("calls POST /products with data", () => {
      const data = { name: "Laptop", sku: "LAP-001", category: "Electronics", price: 999, stock: 50 };
      createProduct(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/products", data);
    });

  });

  describe("getProducts", () => {

    it("calls GET /products", () => {
      getProducts();
      expect(mockAxios.get).toHaveBeenCalledWith("/products");
    });

  });

  describe("updateProduct", () => {

    it("calls PATCH /products/:id with full data", () => {
      const data = { name: "Gaming Laptop", price: 1200, stock: 30 };
      updateProduct("prod-1", data);
      expect(mockAxios.patch).toHaveBeenCalledWith("/products/prod-1", data);
    });

    it("calls PATCH /products/:id with partial data", () => {
      updateProduct("prod-1", { price: 899 });
      expect(mockAxios.patch).toHaveBeenCalledWith("/products/prod-1", { price: 899 });
    });

  });

  describe("deleteProduct", () => {

    it("calls DELETE /products/:id", () => {
      deleteProduct("prod-1");
      expect(mockAxios.delete).toHaveBeenCalledWith("/products/prod-1");
    });

  });

  /* ORDER */

  describe("createOrder", () => {

    it("calls POST /orders with data", () => {
      const data = {
        customerName: "John Doe",
        items: [{ productId: "prod-1", quantity: 2 }]
      };
      createOrder(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/orders", data);
    });

    it("calls POST /orders with multiple items", () => {
      const data = {
        customerName: "Jane",
        items: [
          { productId: "prod-1", quantity: 1 },
          { productId: "prod-2", quantity: 3 }
        ]
      };
      createOrder(data);
      expect(mockAxios.post).toHaveBeenCalledWith("/orders", data);
    });

  });

  describe("updateOrderStatus", () => {

    it("calls PATCH /orders/:id/status with status", () => {
      updateOrderStatus("order-1", "DELIVERED");
      expect(mockAxios.patch).toHaveBeenCalledWith("/orders/order-1/status", { status: "DELIVERED" });
    });

    it("calls PATCH /orders/:id/status with CANCELLED status", () => {
      updateOrderStatus("order-1", "CANCELLED");
      expect(mockAxios.patch).toHaveBeenCalledWith("/orders/order-1/status", { status: "CANCELLED" });
    });

  });

  describe("getOrders", () => {

    it("calls GET /orders", () => {
      getOrders();
      expect(mockAxios.get).toHaveBeenCalledWith("/orders");
    });

  });

});