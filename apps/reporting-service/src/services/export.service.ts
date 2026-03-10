import { reportService } from "./reporting.service.js";
import { generateDashboardPDF } from "../utils/pdf.generator.js";
import { generateDashboardExcel } from "../utils/excel.generator.js";
import { sendReportEmail } from "../utils/email.sender.js";

class ExportService {

  async exportPDF() {

    const dashboard = await reportService.getDashboard();
    return generateDashboardPDF(dashboard);

  }

  async exportExcel() {

    const dashboard = await reportService.getDashboard();
    return generateDashboardExcel(dashboard);

  }

  async exportEmail(email: string) {

    const dashboard = await reportService.getDashboard();
    const pdf = await generateDashboardPDF(dashboard);

    await sendReportEmail(email, pdf, "dashboard-report.pdf");

  }

}

export const exportService = new ExportService();