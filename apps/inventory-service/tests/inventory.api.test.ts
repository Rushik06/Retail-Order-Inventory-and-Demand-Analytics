/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

/* vi.hoisted — all controller mocks defined here to avoid hoisting issues */

const mocks = vi.hoisted(() => ({
  getAllInventoryController: vi.fn((req: any, res: any) =>
    res.status(200).json([{ id: "inv-1" }])
  ),
  getInventoryController: vi.fn((req: any, res: any) =>
    res.status(200).json({ id: "inv-1", productId: "prod-1", warehouseId: "wh-1" })
  ),
  createInventoryController: vi.fn((req: any, res: any) =>
    res.status(201).json({ id: "inv-1", availableQty: 100 })
  ),
  reserveStockController: vi.fn((req: any, res: any) =>
    res.status(200).json({ message: "Stock reserved successfully" })
  ),
  releaseStockController: vi.fn((req: any, res: any) =>
    res.status(200).json({ message: "Stock released successfully" })
  ),
  addStockController: vi.fn((req: any, res: any) =>
    res.status(200).json({ message: "Stock added successfully" })
  ),
  deductStockController: vi.fn((req: any, res: any) =>
    res.status(200).json({ message: "Stock deducted successfully" })
  )
}));

/* MOCKS */

vi.mock("../src/middleware/auth.middleware.js", () => ({
  authenticate: (req: any, _res: any, next: any) => next()
}));

vi.mock("../src/middleware/authorize.middleware.js", () => ({
  authorizeRoles: () => (req: any, _res: any, next: any) => next()
}));

vi.mock("../src/middleware/validate.middleware.js", () => ({
  validate: () => (req: any, _res: any, next: any) => next()
}));

vi.mock("../src/validations/inventory.reservation.validation.js", () => ({
  reserveStockSchema: {},
  releaseStockSchema: {}
}));

vi.mock("../src/validations/inventory.movement.validation.js", () => ({
  addStockSchema: {},
  deductStockSchema: {}
}));

vi.mock("../src/controllers/inventory.reservation.controller.js", () => ({
  reserveStockController: mocks.reserveStockController,
  releaseStockController: mocks.releaseStockController
}));

vi.mock("../src/controllers/inventory.movement.controller.js", () => ({
  addStockController: mocks.addStockController,
  deductStockController: mocks.deductStockController,
  createInventoryController: mocks.createInventoryController
}));

vi.mock("../src/controllers/inventory.query.controller.js", () => ({
  getAllInventoryController: mocks.getAllInventoryController,
  getInventoryController: mocks.getInventoryController
}));

/* import after mocks */

import router from "../src/routes/inventory.routes.js";

describe("Inventory Routes", () => {

  let app: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/inventory", router);
    vi.clearAllMocks();
  });

  /* GET ALL INVENTORY */

  it("GET /api/inventory should return all inventory records", async () => {

    const res = await request(app).get("/api/inventory");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "inv-1" }]);
    expect(mocks.getAllInventoryController).toHaveBeenCalled();

  });

  /* GET INVENTORY BY PRODUCT + WAREHOUSE */

  it("GET /api/inventory/:productId/:warehouseId should return inventory record", async () => {

    const res = await request(app).get("/api/inventory/prod-1/wh-1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: "inv-1",
      productId: "prod-1",
      warehouseId: "wh-1"
    });
    expect(mocks.getInventoryController).toHaveBeenCalled();

  });

  /* CREATE INVENTORY */

  it("POST /api/inventory/create should create inventory record", async () => {

    const res = await request(app)
      .post("/api/inventory/create")
      .send({
        productId: "prod-1",
        warehouseId: "wh-1",
        availableQty: 100,
        reservedQty: 0
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "inv-1", availableQty: 100 });
    expect(mocks.createInventoryController).toHaveBeenCalled();

  });

  /* RESERVE STOCK */

  it("POST /api/inventory/reserve should reserve stock", async () => {

    const res = await request(app)
      .post("/api/inventory/reserve")
      .send({ productId: "prod-1", warehouseId: "wh-1", quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Stock reserved successfully" });
    expect(mocks.reserveStockController).toHaveBeenCalled();

  });

  /* RELEASE STOCK */

  it("POST /api/inventory/release should release stock", async () => {

    const res = await request(app)
      .post("/api/inventory/release")
      .send({ productId: "prod-1", warehouseId: "wh-1", quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Stock released successfully" });
    expect(mocks.releaseStockController).toHaveBeenCalled();

  });

  /* ADD STOCK */

  it("POST /api/inventory/add should add stock", async () => {

    const res = await request(app)
      .post("/api/inventory/add")
      .send({
        productId: "prod-1",
        warehouseId: "wh-1",
        quantity: 20,
        referenceId: "PO-12345"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Stock added successfully" });
    expect(mocks.addStockController).toHaveBeenCalled();

  });

  /* DEDUCT STOCK */

  it("POST /api/inventory/deduct should deduct stock", async () => {

    const res = await request(app)
      .post("/api/inventory/deduct")
      .send({
        productId: "prod-1",
        warehouseId: "wh-1",
        quantity: 10,
        referenceId: "ORDER-001"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Stock deducted successfully" });
    expect(mocks.deductStockController).toHaveBeenCalled();

  });

});