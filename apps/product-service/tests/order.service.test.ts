/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  createOrder,
  updateOrderStatus,
  getOrders
} from "../src/services/order.service.js";

import { sequelize } from "../src/config/index.js";
import { Order } from "../src/models/order.model.js";
import { OrderItem } from "../src/models/orderItem.model.js";
import { Product } from "../src/models/product.model.js";
import { publishOrderCreated } from "../src/utils/rabbitmq.js";

/* MOCKS */

vi.mock("../src/config/index.js", () => ({
  sequelize: {
    transaction: vi.fn()
  }
}));

vi.mock("../src/models/order.model.js", () => ({
  Order: {
    create: vi.fn(),
    findByPk: vi.fn(),
    findAll: vi.fn()
  }
}));

vi.mock("../src/models/orderItem.model.js", () => ({
  OrderItem: {
    create: vi.fn(),
    findAll: vi.fn()
  }
}));

vi.mock("../src/models/product.model.js", () => ({
  Product: {
    findByPk: vi.fn()
  }
}));

vi.mock("../src/utils/rabbitmq.js", () => ({
  publishOrderCreated: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("crypto", () => ({
  randomUUID: vi.fn(() => "mock-order-uuid")
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
    INVALID_ORDER_DATA: "INVALID_ORDER_DATA",
    PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
    INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
    ORDER_NOT_FOUND: "ORDER_NOT_FOUND"
  }
}));

/* HELPERS */

const makeTx = () => ({
  commit: vi.fn().mockResolvedValue(undefined),
  rollback: vi.fn().mockResolvedValue(undefined)
});

const makeProduct = (stock: number, price: number) => ({
  getDataValue: vi.fn((key: string) => {
    const values: Record<string, any> = { stock, price };
    return values[key];
  }),
  set: vi.fn(),
  save: vi.fn().mockResolvedValue(undefined)
});

const makeOrder = (id: string, status: string) => ({
  getDataValue: vi.fn((key: string) => {
    const values: Record<string, any> = { id, status };
    return values[key];
  }),
  set: vi.fn(),
  save: vi.fn().mockResolvedValue(undefined)
});

const makeOrderItem = (productId: string, quantity: number) => ({
  getDataValue: vi.fn((key: string) => {
    const values: Record<string, any> = { productId, quantity };
    return values[key];
  })
});

describe("Order Service", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* CREATE ORDER */

  describe("createOrder", () => {

    it("should create order successfully with correct total", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockProduct = makeProduct(10, 100);
      (Product.findByPk as any).mockResolvedValue(mockProduct);

      const mockOrder = makeOrder("mock-order-uuid", "PENDING");
      (Order.create as any).mockResolvedValue(mockOrder);
      (OrderItem.create as any).mockResolvedValue(undefined);

      const result = await createOrder("John Doe", [
        { productId: "prod-1", quantity: 2 }
      ]);

      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customerName: "John Doe",
          totalAmount: 200,
          status: "PENDING"
        }),
        expect.objectContaining({ transaction: tx })
      );

      expect(tx.commit).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);

    });

    it("should create order items for each item", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockProduct = makeProduct(10, 50);
      (Product.findByPk as any).mockResolvedValue(mockProduct);

      const mockOrder = makeOrder("mock-order-uuid", "PENDING");
      (Order.create as any).mockResolvedValue(mockOrder);
      (OrderItem.create as any).mockResolvedValue(undefined);

      await createOrder("Jane", [
        { productId: "prod-1", quantity: 1 },
        { productId: "prod-2", quantity: 3 }
      ]);

      expect(OrderItem.create).toHaveBeenCalledTimes(2);

    });

    it("should deduct stock and set IN_STOCK after order", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockProduct = makeProduct(5, 100);
      (Product.findByPk as any).mockResolvedValue(mockProduct);

      const mockOrder = makeOrder("mock-order-uuid", "PENDING");
      (Order.create as any).mockResolvedValue(mockOrder);
      (OrderItem.create as any).mockResolvedValue(undefined);

      await createOrder("John", [{ productId: "prod-1", quantity: 3 }]);

      expect(mockProduct.set).toHaveBeenCalledWith("stock", 2);
      expect(mockProduct.set).toHaveBeenCalledWith("status", "IN_STOCK");
      expect(mockProduct.save).toHaveBeenCalled();

    });

    it("should set product status to OUT_OF_STOCK when stock reaches 0", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockProduct = makeProduct(2, 100);
      (Product.findByPk as any).mockResolvedValue(mockProduct);

      const mockOrder = makeOrder("mock-order-uuid", "PENDING");
      (Order.create as any).mockResolvedValue(mockOrder);
      (OrderItem.create as any).mockResolvedValue(undefined);

      await createOrder("John", [{ productId: "prod-1", quantity: 2 }]);

      expect(mockProduct.set).toHaveBeenCalledWith("status", "OUT_OF_STOCK");

    });

    it("should publish order created event after commit", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockProduct = makeProduct(10, 100);
      (Product.findByPk as any).mockResolvedValue(mockProduct);

      const mockOrder = makeOrder("mock-order-uuid", "PENDING");
      (Order.create as any).mockResolvedValue(mockOrder);
      (OrderItem.create as any).mockResolvedValue(undefined);

      await createOrder("John", [{ productId: "prod-1", quantity: 1 }]);

      expect(publishOrderCreated).toHaveBeenCalledWith({
        orderId: "mock-order-uuid",
        items: [{ productId: "prod-1", quantity: 1 }]
      });

    });

    it("should calculate total from multiple items correctly", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      (Product.findByPk as any)
        .mockResolvedValueOnce(makeProduct(10, 100)) // first call in validation loop
        .mockResolvedValueOnce(makeProduct(10, 200)) // second call in validation loop
        .mockResolvedValueOnce(makeProduct(10, 100)) // first call in stock-deduct loop
        .mockResolvedValueOnce(makeProduct(10, 200)); // second call in stock-deduct loop

      const mockOrder = makeOrder("mock-order-uuid", "PENDING");
      (Order.create as any).mockResolvedValue(mockOrder);
      (OrderItem.create as any).mockResolvedValue(undefined);

      await createOrder("John", [
        { productId: "prod-1", quantity: 2 },  // 2 * 100 = 200
        { productId: "prod-2", quantity: 1 }   // 1 * 200 = 200
      ]);

      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({ totalAmount: 400 }),
        expect.anything()
      );

    });

    it("should throw INVALID_ORDER_DATA when customerName is empty", async () => {

      await expect(
        createOrder("", [{ productId: "p1", quantity: 1 }])
      ).rejects.toThrow("INVALID_ORDER_DATA");

    });

    it("should throw INVALID_ORDER_DATA when items array is empty", async () => {

      await expect(
        createOrder("John", [])
      ).rejects.toThrow("INVALID_ORDER_DATA");

    });

    it("should throw PRODUCT_NOT_FOUND when product does not exist", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);
      (Product.findByPk as any).mockResolvedValue(null);

      await expect(
        createOrder("John", [{ productId: "nonexistent", quantity: 1 }])
      ).rejects.toThrow("PRODUCT_NOT_FOUND");

      expect(tx.rollback).toHaveBeenCalled();
      expect(tx.commit).not.toHaveBeenCalled();

    });

    it("should throw INSUFFICIENT_STOCK when stock is less than quantity", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);
      (Product.findByPk as any).mockResolvedValue(makeProduct(2, 100));

      await expect(
        createOrder("John", [{ productId: "prod-1", quantity: 5 }])
      ).rejects.toThrow("INSUFFICIENT_STOCK");

      expect(tx.rollback).toHaveBeenCalled();
      expect(tx.commit).not.toHaveBeenCalled();

    });

    it("should rollback transaction on any error", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);
      (Product.findByPk as any).mockResolvedValue(null);

      await expect(
        createOrder("John", [{ productId: "p1", quantity: 1 }])
      ).rejects.toThrow();

      expect(tx.rollback).toHaveBeenCalled();

    });

  });

  /* UPDATE ORDER STATUS */

  describe("updateOrderStatus", () => {

    it("should update order status successfully", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockOrder = makeOrder("order-1", "PENDING");
      (Order.findByPk as any).mockResolvedValue(mockOrder);

      const result = await updateOrderStatus("order-1", "DELIVERED");

      expect(mockOrder.set).toHaveBeenCalledWith("status", "DELIVERED");
      expect(mockOrder.save).toHaveBeenCalled();
      expect(tx.commit).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);

    });

    it("should restore stock when order is cancelled", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockOrder = makeOrder("order-1", "PENDING");
      (Order.findByPk as any).mockResolvedValue(mockOrder);

      const mockOrderItem = makeOrderItem("prod-1", 3);
      (OrderItem.findAll as any).mockResolvedValue([mockOrderItem]);

      const mockProduct = makeProduct(2, 100);
      (Product.findByPk as any).mockResolvedValue(mockProduct);

      await updateOrderStatus("order-1", "CANCELLED");

      // stock should be restored: 2 + 3 = 5
      expect(mockProduct.set).toHaveBeenCalledWith("stock", 5);
      expect(mockProduct.set).toHaveBeenCalledWith("status", "IN_STOCK");
      expect(mockProduct.save).toHaveBeenCalled();

    });

    it("should not restore stock when status is not CANCELLED", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      const mockOrder = makeOrder("order-1", "PENDING");
      (Order.findByPk as any).mockResolvedValue(mockOrder);

      await updateOrderStatus("order-1", "DELIVERED");

      expect(OrderItem.findAll).not.toHaveBeenCalled();
      expect(Product.findByPk).not.toHaveBeenCalled();

    });

    it("should not restore stock when order is already CANCELLED", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);

      // order is already CANCELLED
      const mockOrder = makeOrder("order-1", "CANCELLED");
      (Order.findByPk as any).mockResolvedValue(mockOrder);

      await updateOrderStatus("order-1", "CANCELLED");

      expect(OrderItem.findAll).not.toHaveBeenCalled();

    });

    it("should throw ORDER_NOT_FOUND when order does not exist", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);
      (Order.findByPk as any).mockResolvedValue(null);

      await expect(
        updateOrderStatus("nonexistent", "DELIVERED")
      ).rejects.toThrow("ORDER_NOT_FOUND");

      expect(tx.rollback).toHaveBeenCalled();
      expect(tx.commit).not.toHaveBeenCalled();

    });

    it("should rollback transaction on error", async () => {

      const tx = makeTx();
      (sequelize.transaction as any).mockResolvedValue(tx);
      (Order.findByPk as any).mockResolvedValue(null);

      await expect(
        updateOrderStatus("order-1", "DELIVERED")
      ).rejects.toThrow();

      expect(tx.rollback).toHaveBeenCalled();

    });

  });

  /* GET ORDERS */

  describe("getOrders", () => {

    it("should return all orders with items and products", async () => {

      const mockOrders = [
        makeOrder("order-1", "PENDING"),
        makeOrder("order-2", "DELIVERED")
      ];

      (Order.findAll as any).mockResolvedValue(mockOrders);

      const result = await getOrders();

      expect(Order.findAll).toHaveBeenCalledWith({
        include: [
          expect.objectContaining({
            model: OrderItem,
            include: [Product]
          })
        ],
        order: [["createdAt", "DESC"]]
      });

      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(2);

    });

    it("should return empty array when no orders exist", async () => {

      (Order.findAll as any).mockResolvedValue([]);

      const result = await getOrders();

      expect(result).toEqual([]);

    });

  });

});