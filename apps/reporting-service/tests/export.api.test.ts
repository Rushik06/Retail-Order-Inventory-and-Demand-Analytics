import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

import router from "../src/routes/export.routes.js";
import { exportController } from "../src/controllers/export.controller.js";

/* MOCK MIDDLEWARES */

/*eslint-disable */
vi.mock("../middleware/authenticate.js", () => ({
  authenticate: (req: any, res: any, next: any) => next()
}));

vi.mock("../middleware/authorize.js", () => ({
  authorizeRoles: () => (req: any, res: any, next: any) => next()
}));

vi.mock("../middleware/validate-schema.js", () => ({
  validate: () => (req: any, res: any, next: any) => next()
}));

/* MOCK CONTROLLER */

vi.mock("../controllers/export.controller.js", () => ({
  exportController: {
    exportPDF: vi.fn((req, res) => res.send("pdf-file")),
    exportExcel: vi.fn((req, res) => res.send("excel-file")),
    exportEmail: vi.fn((req, res) =>
      res.json({ success: true, message: "Email sent successfully" })
    )
  }
}));

describe("Export Routes", () => {

  const app = express();
  app.use(express.json());
  app.use("/reports/export", router);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* PDF EXPORT */

  it("GET /reports/export/pdf should export PDF", async () => {

    const res = await request(app).get("/reports/export/pdf");

    expect(res.status).toBe(200);
    expect(res.text).toBe("pdf-file");

    expect(exportController.exportPDF).toHaveBeenCalled();

  });

  /* EXCEL EXPORT */

  it("GET /reports/export/excel should export Excel", async () => {

    const res = await request(app).get("/reports/export/excel");

    expect(res.status).toBe(200);
    expect(res.text).toBe("excel-file");

    expect(exportController.exportExcel).toHaveBeenCalled();

  });

  /* EMAIL EXPORT */

  it("POST /reports/export/email should send email", async () => {

    const res = await request(app)
      .post("/reports/export/email")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      success: true,
      message: "Email sent successfully"
    });

    expect(exportController.exportEmail).toHaveBeenCalled();

  });

});