/*eslint-disable*/
import ExcelJS from "exceljs";

export const generateDashboardExcel = async (data: any): Promise<Buffer> => {

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Dashboard");

  sheet.columns = [
    { header: "Metric", key: "metric", width: 30 },
    { header: "Value", key: "value", width: 20 }
  ];

  sheet.addRow({ metric: "Total Products", value: data.counters.totalProducts });
  sheet.addRow({ metric: "Total Warehouses", value: data.counters.totalWarehouses });
  sheet.addRow({ metric: "Low Stock Items", value: data.counters.lowStockItems });
  sheet.addRow({ metric: "Total Orders", value: data.counters.totalOrders });
  sheet.addRow({ metric: "Total Revenue", value: data.counters.totalRevenue });

  const buffer = await workbook.xlsx.writeBuffer();

  return Buffer.from(buffer);

};