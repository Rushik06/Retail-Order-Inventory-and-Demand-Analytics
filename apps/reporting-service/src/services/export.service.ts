import { reportService } from "./reporting.service.js";
import { generateDashboardPDF } from "../utils/pdf.generator.js";
import { generateDashboardExcel } from "../utils/excel.generator.js";
import { sendReportEmail } from "../utils/email.sender.js";
import type { DashboardData } from "../types/generator.types.js";

class ExportService {

  async exportPDF() {

    const dashboard = await reportService.getDashboard() as DashboardData;
    return generateDashboardPDF(dashboard);

  }

  async exportExcel() {

    const dashboard = await reportService.getDashboard() as DashboardData;
    return generateDashboardExcel(dashboard);

  }

  async exportEmail(email: string) {

    const dashboard = await reportService.getDashboard() as DashboardData;

    const pdf = await generateDashboardPDF(dashboard);
    const excel = await generateDashboardExcel(dashboard);

    await sendReportEmail(email, pdf, excel);

  }

}

export const exportService = new ExportService();