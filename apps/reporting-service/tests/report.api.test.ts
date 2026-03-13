import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import router from "../src/routes/reporting.routes.js";
import { reportController } from "../src/controllers/reporting.controller.js";

/* MOCK MIDDLEWARES */

/*eslint-disable */
vi.mock("../middleware/authenticate.js", () => ({
  authenticate: (req: any, res: any, next: any) => next()
}));

vi.mock("../middleware/authorize.js", () => ({
  authorizeRoles: () => (req: any, res: any, next: any) => next()
}));

/* MOCK CONTROLLER */

vi.mock("../controllers/reporting.controller.js", () => ({
  reportController: {
    getDashboard: vi.fn((req, res) => res.json({ dashboard: true })),
    getCounters: vi.fn((req, res) => res.json({ counters: true })),
    getCharts: vi.fn((req, res) => res.json({ charts: true })),
    getTables: vi.fn((req, res) => res.json({ tables: true }))
  }
}));

describe("Report Routes", () => {

  const app = express();
  app.use(express.json());
  app.use("/reports", router);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* DASHBOARD */

  it("GET /reports/dashboard should return dashboard data", async () => {

    const res = await request(app).get("/reports/dashboard");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ dashboard: true });

    expect(reportController.getDashboard).toHaveBeenCalled();

  });

  /* COUNTERS */

  it("GET /reports/counters should return counters", async () => {

    const res = await request(app).get("/reports/counters");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ counters: true });

    expect(reportController.getCounters).toHaveBeenCalled();

  });

  /* CHARTS */

  it("GET /reports/charts should return charts", async () => {

    const res = await request(app).get("/reports/charts");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ charts: true });

    expect(reportController.getCharts).toHaveBeenCalled();

  });

  /* TABLES */

  it("GET /reports/tables should return tables", async () => {

    const res = await request(app).get("/reports/tables");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ tables: true });

    expect(reportController.getTables).toHaveBeenCalled();

  });

});