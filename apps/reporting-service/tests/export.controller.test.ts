/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import { exportController } from "../src/controllers/export.controller.js";
import { exportService } from "../src/services/export.service.js";

/* MOCKS */

vi.mock("../src/services/export.service.js", () => ({
  exportService: {
    exportPDF: vi.fn(),
    exportExcel: vi.fn(),
    exportEmail: vi.fn()
  }
}));

/* HELPERS */

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe("ExportController", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* EXPORT PDF */

  describe("exportPDF", () => {

    it("should set correct headers and send PDF buffer", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockFile = Buffer.from("pdf-content");
      (exportService.exportPDF as any).mockResolvedValue(mockFile);

      await exportController.exportPDF(req, res);

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

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (exportService.exportPDF as any).mockRejectedValue(new Error("PDF_ERROR"));

      await expect(exportController.exportPDF(req, res)).rejects.toThrow("PDF_ERROR");

    });

  });

  /* EXPORT EXCEL */

  describe("exportExcel", () => {

    it("should set correct headers and send Excel buffer", async () => {

      const req = {} as Request;
      const res = mockResponse();

      const mockFile = Buffer.from("excel-content");
      (exportService.exportExcel as any).mockResolvedValue(mockFile);

      await exportController.exportExcel(req, res);

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

    it("should throw when service throws", async () => {

      const req = {} as Request;
      const res = mockResponse();

      (exportService.exportExcel as any).mockRejectedValue(new Error("EXCEL_ERROR"));

      await expect(exportController.exportExcel(req, res)).rejects.toThrow("EXCEL_ERROR");

    });

  });

  /* EXPORT EMAIL */

  describe("exportEmail", () => {

    it("should return 200 with success message when email is provided", async () => {

      const req = { body: { email: "test@test.com" } } as Request;
      const res = mockResponse();

      (exportService.exportEmail as any).mockResolvedValue(undefined);

      await exportController.exportEmail(req, res);

      expect(exportService.exportEmail).toHaveBeenCalledWith("test@test.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Email sent successfully"
      });

    });

    it("should return 400 when email is missing", async () => {

      const req = { body: {} } as Request;
      const res = mockResponse();

      await exportController.exportEmail(req, res);

      expect(exportService.exportEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email is required" });

    });

    it("should return 400 when email is empty string", async () => {

      const req = { body: { email: "" } } as Request;
      const res = mockResponse();

      await exportController.exportEmail(req, res);

      expect(exportService.exportEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email is required" });

    });

    it("should throw when service throws", async () => {

      const req = { body: { email: "test@test.com" } } as Request;
      const res = mockResponse();

      (exportService.exportEmail as any).mockRejectedValue(new Error("EMAIL_ERROR"));

      await expect(exportController.exportEmail(req, res)).rejects.toThrow("EMAIL_ERROR");

    });

  });

});