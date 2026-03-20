/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

import router from "../src/routes/order.routes.js";
import * as controller from "../src/controllers/order.controller.js";

/* MOCK MIDDLEWARE */

vi.mock("../src/middleware/authorize.js", () => ({
  authorize: () => (req: any, res: any, next: any) => next()
}));

/* MOCK CONTROLLER — defined inside factory to avoid hoisting issues */

vi.mock("../src/controllers/order.controller.js", () => ({
  createOrder: vi.fn((req: any, res: any) =>
    res.status(201).json({ id: "order-1", customerName: "John Doe", status: "PENDING" })
  ),
  updateOrderStatus: vi.fn((req: any, res: any) =>
    res.status(200).json({ id: "order-1", status: "SHIPPED" })
  ),
  getOrders: vi.fn((req: any, res: any) =>
    res.status(200).json([{ id: "order-1", status: "PENDING" }])
  )
}));

describe("Order Routes", () => {

  let app: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/orders", router);
    vi.clearAllMocks();
  });

  /* CREATE ORDER */

  it("POST /api/orders should create order", async () => {

    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "John Doe",
        items: [{ productId: "prod-1", quantity: 2 }]
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "order-1", customerName: "John Doe", status: "PENDING" });
    expect(controller.createOrder).toHaveBeenCalled();

  });

  /* UPDATE ORDER STATUS */

  it("PATCH /api/orders/:id/status should update order status", async () => {

    const res = await request(app)
      .patch("/api/orders/order-1/status")
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "order-1", status: "SHIPPED" });
    expect(controller.updateOrderStatus).toHaveBeenCalled();

  });

  /* GET ORDERS */

  it("GET /api/orders should return all orders", async () => {

    const res = await request(app).get("/api/orders");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "order-1", status: "PENDING" }]);
    expect(controller.getOrders).toHaveBeenCalled();

  });

});