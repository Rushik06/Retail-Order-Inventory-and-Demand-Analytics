import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

import { exportController } from "../src/controllers/export.controller.js";
import { exportService } from "../src/services/export.service.js";

/* MOCK SERVICE */

/*eslint-disable */
vi.mock("../src/services/export.service.js", () => ({
  exportService: {
    exportPDF: vi.fn(),
    exportExcel: vi.fn(),
    exportEmail: vi.fn()
  }
}));

describe("ExportController", () => {

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {

    req = {
      body: {}
    };

    res = {
      setHeader: vi.fn(),
      send: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    next = vi.fn();

    vi.clearAllMocks();

  });

  /* EXPORT PDF */

  it("should export PDF file", async () => {

    const mockFile = Buffer.from("pdf");

    (exportService.exportPDF as any).mockResolvedValue(mockFile);

    await exportController.exportPDF(
      req as Request,
      res as Response,
      next
    );

    expect(exportService.exportPDF).toHaveBeenCalled();

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/pdf"
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      "attachment; filename=dashboard-report.pdf"
    );

    expect(res.send).toHaveBeenCalledWith(mockFile);

  });

  it("should call next on PDF error", async () => {

    const error = new Error("PDF error");

    (exportService.exportPDF as any).mockRejectedValue(error);

    await exportController.exportPDF(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(error);

  });

  /* EXPORT EXCEL */

  it("should export Excel file", async () => {

    const mockFile = Buffer.from("excel");

    (exportService.exportExcel as any).mockResolvedValue(mockFile);

    await exportController.exportExcel(
      req as Request,
      res as Response,
      next
    );

    expect(exportService.exportExcel).toHaveBeenCalled();

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      "attachment; filename=dashboard-report.xlsx"
    );

    expect(res.send).toHaveBeenCalledWith(mockFile);

  });

  it("should call next on Excel error", async () => {

    const error = new Error("Excel error");

    (exportService.exportExcel as any).mockRejectedValue(error);

    await exportController.exportExcel(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(error);

  });

  /* EXPORT EMAIL */

  it("should send report email", async () => {

    req.body = { email: "test@example.com" };

    (exportService.exportEmail as any).mockResolvedValue(undefined);

    await exportController.exportEmail(
      req as Request,
      res as Response,
      next
    );

    expect(exportService.exportEmail).toHaveBeenCalledWith("test@example.com");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Email sent successfully"
    });

  });

  it("should return 400 if email missing", async () => {

    req.body = {};

    await exportController.exportEmail(
      req as Request,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Email is required"
    });

  });

  it("should call next on email error", async () => {

    req.body = { email: "test@example.com" };

    const error = new Error("Email error");

    (exportService.exportEmail as any).mockRejectedValue(error);

    await exportController.exportEmail(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(error);

  });

});