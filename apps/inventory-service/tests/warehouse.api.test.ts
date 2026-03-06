/*eslint-disable */
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

import router from "../src/routes/warehouse.routes.js";

/* MOCK MIDDLEWARES */

vi.mock("../../src/middleware/auth.middleware.js", () => ({
  authenticate: (req: any, res: any, next: any) => next()
}));

vi.mock("../../src/middleware/authorize.middleware.js", () => ({
  authorizeRoles: () => (req: any, res: any, next: any) => next()
}));

vi.mock("../../src/middleware/validate.middleware.js", () => ({
  validate: () => (req: any, res: any, next: any) => next()
}));

/* MOCK CONTROLLERS */

const mockCreate = vi.fn((req, res) => res.status(201).json({ message: "created" }));
const mockGetAll = vi.fn((req, res) => res.status(200).json([]));
const mockGetById = vi.fn((req, res) => res.status(200).json({ id: "1" }));
const mockUpdate = vi.fn((req, res) => res.status(200).json({ message: "updated" }));
const mockDeactivate = vi.fn((req, res) => res.status(200).json({ message: "deactivated" }));
const mockActivate = vi.fn((req, res) => res.status(200).json({ message: "activated" }));

vi.mock("../../src/controllers/warehouse.controller.js", () => ({
  createWarehouseController: mockCreate,
  getAllWarehousesController: mockGetAll,
  getWarehouseByIdController: mockGetById,
  updateWarehouseController: mockUpdate,
  deactivateWarehouseController: mockDeactivate,
  activateWarehouseController: mockActivate
}));

describe("Warehouse Routes", () => {

  let app: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/warehouses", router);
    vi.clearAllMocks();
  });

  /* CREATE WAREHOUSE */

  it("POST /warehouses should create warehouse", async () => {

    const res = await request(app)
      .post("/warehouses")
      .send({
        name: "Delhi",
        location: "India"
      });

    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalled();

  });

  /* GET ALL WAREHOUSES */

  it("GET /warehouses should return warehouses", async () => {

    const res = await request(app)
      .get("/warehouses");

    expect(res.status).toBe(200);
    expect(mockGetAll).toHaveBeenCalled();

  });

  /* GET BY ID */

  it("GET /warehouses/:id should return warehouse", async () => {

    const res = await request(app)
      .get("/warehouses/1");

    expect(res.status).toBe(200);
    expect(mockGetById).toHaveBeenCalled();

  });

  /* UPDATE WAREHOUSE */

  it("PATCH /warehouses/:id should update warehouse", async () => {

    const res = await request(app)
      .patch("/warehouses/1")
      .send({
        name: "Updated"
      });

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();

  });

  /* DEACTIVATE WAREHOUSE */

  it("PATCH /warehouses/:id/deactivate should deactivate warehouse", async () => {

    const res = await request(app)
      .patch("/warehouses/1/deactivate");

    expect(res.status).toBe(200);
    expect(mockDeactivate).toHaveBeenCalled();

  });

  /* ACTIVATE WAREHOUSE */

  it("PATCH /warehouses/:id/activate should activate warehouse", async () => {

    const res = await request(app)
      .patch("/warehouses/1/activate");

    expect(res.status).toBe(200);
    expect(mockActivate).toHaveBeenCalled();

  });

});