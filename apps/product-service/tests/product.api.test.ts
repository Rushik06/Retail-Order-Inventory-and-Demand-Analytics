/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

import router from "../src/routes/product.routes.js";
import * as controller from "../src/controllers/product.controller.js";

/* MOCK MIDDLEWARE */

vi.mock("../src/middleware/authorize.js", () => ({
  authorize: () => (req: any, res: any, next: any) => next()
}));

/* MOCK CONTROLLER — defined inside factory to avoid hoisting issues */

vi.mock("../src/controllers/product.controller.js", () => ({
  createProduct: vi.fn((req: any, res: any) =>
    res.status(201).json({ id: "prod-1", name: "Laptop" })
  ),
  getProducts: vi.fn((req: any, res: any) =>
    res.status(200).json([{ id: "prod-1", name: "Laptop" }])
  ),
  getProductById: vi.fn((req: any, res: any) =>
    res.status(200).json({ id: "prod-1", name: "Laptop" })
  ),
  updateProduct: vi.fn((req: any, res: any) =>
    res.status(200).json({ id: "prod-1", name: "Updated Laptop" })
  ),
  deleteProduct: vi.fn((req: any, res: any) =>
    res.status(200).json({ message: "Product deleted successfully" })
  )
}));

describe("Product Routes", () => {

  let app: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/products", router);
    vi.clearAllMocks();
  });

  /* CREATE PRODUCT */

  it("POST /api/products should create product", async () => {

    const res = await request(app)
      .post("/api/products")
      .send({ name: "Laptop", category: "Electronics", price: 999 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "prod-1", name: "Laptop" });
    expect(controller.createProduct).toHaveBeenCalled();

  });

  /* GET ALL PRODUCTS */

  it("GET /api/products should return all products", async () => {

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "prod-1", name: "Laptop" }]);
    expect(controller.getProducts).toHaveBeenCalled();

  });

  /* UPDATE PRODUCT */

  it("PATCH /api/products/:id should update product", async () => {

    const res = await request(app)
      .patch("/api/products/prod-1")
      .send({ name: "Updated Laptop" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "prod-1", name: "Updated Laptop" });
    expect(controller.updateProduct).toHaveBeenCalled();

  });

  /* DELETE PRODUCT */

  it("DELETE /api/products/:id should delete product", async () => {

    const res = await request(app).delete("/api/products/prod-1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Product deleted successfully" });
    expect(controller.deleteProduct).toHaveBeenCalled();

  });

});