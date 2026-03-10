/*eslint-disable*/
import PDFDocument from "pdfkit";

export const generateDashboardPDF = (data: any): Promise<Buffer> => {

  return new Promise((resolve) => {

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(20).text("Inventory Dashboard Report", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14).text(`Total Products: ${data.counters.totalProducts}`);
    doc.text(`Total Warehouses: ${data.counters.totalWarehouses}`);
    doc.text(`Low Stock Items: ${data.counters.lowStockItems}`);
    doc.text(`Total Orders: ${data.counters.totalOrders}`);
    doc.text(`Total Revenue: ${data.counters.totalRevenue}`);

    doc.moveDown();
    doc.text("Generated At: " + new Date().toISOString());

    doc.end();

  });

};