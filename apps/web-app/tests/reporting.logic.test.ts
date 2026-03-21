// @vitest-environment jsdom
/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/api/reporting-axios", () => ({
  getDashboard: vi.fn(),
  getCounters: vi.fn(),
  getCharts: vi.fn(),
  getTables: vi.fn(),
  exportPDF: vi.fn(),
  exportExcel: vi.fn(),
  exportReportEmail: vi.fn()
}));

import {
  getDashboard,
  getCounters,
  getCharts,
  getTables,
  exportPDF,
  exportExcel,
  exportReportEmail
} from "../src/api/reporting-axios.js";

import {
  fetchDashboard,
  fetchCounters,
  fetchCharts,
  fetchTables,
  exportDashboardPDF,
  exportDashboardExcel,
  sendDashboardReportEmail
} from "../src/app/reporting.logic.js";

describe("Reporting Actions", () => {

  beforeEach(() => {
    (getDashboard as any).mockClear();
    (getCounters as any).mockClear();
    (getCharts as any).mockClear();
    (getTables as any).mockClear();
    (exportPDF as any).mockClear();
    (exportExcel as any).mockClear();
    (exportReportEmail as any).mockClear();

    vi.spyOn(window.URL, "createObjectURL").mockReturnValue("blob:mock-url");
    vi.spyOn(window.URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(document.body, "appendChild").mockImplementation(() => document.body as any);
  });

  /* FETCH */

  it("fetchDashboard calls getDashboard and returns data", async () => {
    const mockData = { counters: {}, charts: {}, tables: {} };
    (getDashboard as any).mockResolvedValue({ data: mockData });

    const result = await fetchDashboard();

    expect(getDashboard).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it("fetchCounters calls getCounters and returns data", async () => {
    const mockData = { totalProducts: 10, totalOrders: 20 };
    (getCounters as any).mockResolvedValue({ data: mockData });

    const result = await fetchCounters();

    expect(getCounters).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it("fetchCharts calls getCharts and returns data", async () => {
    const mockData = { warehouseStock: [], ordersByStatus: [] };
    (getCharts as any).mockResolvedValue({ data: mockData });

    const result = await fetchCharts();

    expect(getCharts).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it("fetchTables calls getTables and returns data", async () => {
    const mockData = { recentOrders: [], recentActivity: [] };
    (getTables as any).mockResolvedValue({ data: mockData });

    const result = await fetchTables();

    expect(getTables).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  /* EXPORT PDF */

  describe("exportDashboardPDF", () => {

    it("calls exportPDF", async () => {
      (exportPDF as any).mockResolvedValue({ data: new Blob(["pdf"]) });

      await exportDashboardPDF();

      expect(exportPDF).toHaveBeenCalled();
    });

    it("creates object URL from blob", async () => {
      (exportPDF as any).mockResolvedValue({ data: new Blob(["pdf"]) });

      await exportDashboardPDF();

      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    it("creates anchor element with correct download attribute", async () => {
      (exportPDF as any).mockResolvedValue({ data: new Blob(["pdf"]) });

      const mockClick = vi.fn();
      vi.spyOn(document, "createElement").mockReturnValue({
        href: "",
        setAttribute: vi.fn(),
        click: mockClick
      } as any);

      await exportDashboardPDF();

      expect(mockClick).toHaveBeenCalled();
    });

    it("sets download filename to dashboard-report.pdf", async () => {
      (exportPDF as any).mockResolvedValue({ data: new Blob(["pdf"]) });

      const mockSetAttribute = vi.fn();
      vi.spyOn(document, "createElement").mockReturnValue({
        href: "",
        setAttribute: mockSetAttribute,
        click: vi.fn()
      } as any);

      await exportDashboardPDF();

      expect(mockSetAttribute).toHaveBeenCalledWith("download", "dashboard-report.pdf");
    });

  });

  /* EXPORT EXCEL */

  describe("exportDashboardExcel", () => {

    it("calls exportExcel", async () => {
      (exportExcel as any).mockResolvedValue({ data: new Blob(["excel"]) });

      await exportDashboardExcel();

      expect(exportExcel).toHaveBeenCalled();
    });

    it("creates object URL from blob", async () => {
      (exportExcel as any).mockResolvedValue({ data: new Blob(["excel"]) });

      await exportDashboardExcel();

      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    it("sets download filename to dashboard-report.xlsx", async () => {
      (exportExcel as any).mockResolvedValue({ data: new Blob(["excel"]) });

      const mockSetAttribute = vi.fn();
      vi.spyOn(document, "createElement").mockReturnValue({
        href: "",
        setAttribute: mockSetAttribute,
        click: vi.fn()
      } as any);

      await exportDashboardExcel();

      expect(mockSetAttribute).toHaveBeenCalledWith("download", "dashboard-report.xlsx");
    });

  });

  /* EXPORT EMAIL */

  it("sendDashboardReportEmail calls exportReportEmail with email and returns data", async () => {
    const mockData = { message: "Email sent" };
    (exportReportEmail as any).mockResolvedValue({ data: mockData });

    const result = await sendDashboardReportEmail("test@test.com");

    expect(exportReportEmail).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(result).toEqual(mockData);
  });

});