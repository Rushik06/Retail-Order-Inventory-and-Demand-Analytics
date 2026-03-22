/*eslint-disable*/
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn()
}));

vi.mock("../src/api/api-client", () => ({
  createApiClient: vi.fn(() => mockAxios)
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

describe("Reporting API", () => {

  beforeEach(() => {
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();
  });

  /* REPORTING */

  it("getDashboard calls GET /reports/dashboard", () => {
    getDashboard();
    expect(mockAxios.get).toHaveBeenCalledWith("/reports/dashboard");
  });

  it("getCounters calls GET /reports/counters", () => {
    getCounters();
    expect(mockAxios.get).toHaveBeenCalledWith("/reports/counters");
  });

  it("getCharts calls GET /reports/charts", () => {
    getCharts();
    expect(mockAxios.get).toHaveBeenCalledWith("/reports/charts");
  });

  it("getTables calls GET /reports/tables", () => {
    getTables();
    expect(mockAxios.get).toHaveBeenCalledWith("/reports/tables");
  });

  /* EXPORT */

  it("exportPDF calls GET /reports/export/pdf with responseType blob", () => {
    exportPDF();
    expect(mockAxios.get).toHaveBeenCalledWith("/reports/export/pdf", { responseType: "blob" });
  });

  it("exportExcel calls GET /reports/export/excel with responseType blob", () => {
    exportExcel();
    expect(mockAxios.get).toHaveBeenCalledWith("/reports/export/excel", { responseType: "blob" });
  });

  it("exportReportEmail calls POST /reports/export/email with email", () => {
    exportReportEmail({ email: "test@test.com" });
    expect(mockAxios.post).toHaveBeenCalledWith("/reports/export/email", { email: "test@test.com" });
  });

});