import { describe, it, expect, vi, beforeEach } from "vitest";

import { exportService } from "../src/services/export.service.js";
import { reportService } from "../src/services/reporting.service.js";
import { generateDashboardPDF } from "../src/utils/pdf.generator.js";
import { generateDashboardExcel } from "../src/utils/excel.generator.js";
import { sendReportEmail } from "../src/utils/email.sender.js";

/* MOCK MODULES */

/*eslint-disable */
vi.mock("../src/services/reporting.service.js", () => ({
  reportService: {
    getDashboard: vi.fn()
  }
}));

vi.mock("../src/utils/pdf.generator.js", () => ({
  generateDashboardPDF: vi.fn()
}));

vi.mock("../src/utils/excel.generator.js", () => ({
  generateDashboardExcel: vi.fn()
}));

vi.mock("../src/utils/email.sender.js", () => ({
  sendReportEmail: vi.fn()
}));

describe("ExportService", () => {

  const mockDashboard = {
    counters: {
      totalProducts: 10,
      totalWarehouses: 5,
      lowStockItems: 2,
      totalOrders: 20,
      totalRevenue: 1000
    },
    charts: {},
    tables: {}
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* EXPORT PDF */

  it("should export dashboard as PDF", async () => {

    const mockPDF = Buffer.from("pdf");

    (reportService.getDashboard as any).mockResolvedValue(mockDashboard);
    (generateDashboardPDF as any).mockResolvedValue(mockPDF);

    const result = await exportService.exportPDF();

    expect(reportService.getDashboard).toHaveBeenCalled();
    expect(generateDashboardPDF).toHaveBeenCalledWith(mockDashboard);
    expect(result).toEqual(mockPDF);

  });

  /* EXPORT EXCEL */

  it("should export dashboard as Excel", async () => {

    const mockExcel = Buffer.from("excel");

    (reportService.getDashboard as any).mockResolvedValue(mockDashboard);
    (generateDashboardExcel as any).mockResolvedValue(mockExcel);

    const result = await exportService.exportExcel();

    expect(reportService.getDashboard).toHaveBeenCalled();
    expect(generateDashboardExcel).toHaveBeenCalledWith(mockDashboard);
    expect(result).toEqual(mockExcel);

  });

  /* EXPORT EMAIL */

  it("should send dashboard report email with PDF and Excel", async () => {

    const mockPDF = Buffer.from("pdf");
    const mockExcel = Buffer.from("excel");

    (reportService.getDashboard as any).mockResolvedValue(mockDashboard);
    (generateDashboardPDF as any).mockResolvedValue(mockPDF);
    (generateDashboardExcel as any).mockResolvedValue(mockExcel);

    await exportService.exportEmail("test@example.com");

    expect(reportService.getDashboard).toHaveBeenCalled();
    expect(generateDashboardPDF).toHaveBeenCalledWith(mockDashboard);
    expect(generateDashboardExcel).toHaveBeenCalledWith(mockDashboard);

    expect(sendReportEmail).toHaveBeenCalledWith(
      "test@example.com",
      mockPDF,
      mockExcel
    );

  });

});