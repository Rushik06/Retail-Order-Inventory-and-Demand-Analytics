import PDFDocument from "pdfkit";
import type { DashboardData } from "../types/generator.types.js";

export const generateDashboardPDF = (
  data: DashboardData
): Promise<Buffer> => {

  return new Promise((resolve) => {

    const doc = new PDFDocument({ margin: 40 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    /* TITLE */

    doc
      .fontSize(20)
      .text("Retail Inventory Dashboard Report", { align: "center" });

    doc.moveDown(2);

    /* COUNTERS */

    doc.fontSize(16).text("Dashboard Summary");
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Total Products: ${data.counters.totalProducts}`);
    doc.text(`Total Warehouses: ${data.counters.totalWarehouses}`);
    doc.text(`Low Stock Items: ${data.counters.lowStockItems}`);
    doc.text(`Total Orders: ${data.counters.totalOrders}`);
    doc.text(`Total Revenue: ₹${data.counters.totalRevenue}`);

    doc.moveDown(2);

    /* WAREHOUSE STOCK CHART DATA */

    doc.fontSize(16).text("Warehouse Stock Distribution");
    doc.moveDown();

    data.charts.warehouseStock.forEach((item) => {
      doc.text(`${item.warehouse}: ${item.total_stock}`);
    });

    doc.moveDown(2);

    /* CATEGORY DISTRIBUTION */

    doc.fontSize(16).text("Product Category Distribution");
    doc.moveDown();

    data.charts.categoryDistribution.forEach((item) => {
      doc.text(`${item.category}: ${item.total_products}`);
    });

    doc.moveDown(2);

    /* ORDERS BY STATUS */

    doc.fontSize(16).text("Orders by Status");
    doc.moveDown();

    data.charts.ordersByStatus.forEach((item) => {
      doc.text(`${item.status}: ${item.count}`);
    });

    doc.moveDown(2);

    /* TOP SELLING PRODUCTS */

    doc.fontSize(16).text("Top Selling Products");
    doc.moveDown();

    data.charts.topSellingProducts.forEach((item) => {
      doc.text(`${item.product}: ${item.total_sold}`);
    });

    doc.addPage();

    /* RECENT ORDERS */

    doc.fontSize(16).text("Recent Orders");
    doc.moveDown();

    data.tables.recentOrders.forEach((order) => {

      doc.text(
        `${order.customer_name} | ${order.product_name} | ${order.status} | ${order.order_date}`
      );

    });

    doc.moveDown(2);

    /* INVENTORY ACTIVITY */

    doc.fontSize(16).text("Inventory Activity");
    doc.moveDown();

    data.tables.recentActivity.forEach((activity) => {

      doc.text(
        `${activity.product_name} | ${activity.warehouse_name} | ${activity.action_type} | Qty: ${activity.new_available_qty}`
      );

    });

    doc.moveDown();

    /* FOOTER */

    doc
      .fontSize(10)
      .text("Generated At: " + new Date().toISOString(), {
        align: "right"
      });

    doc.end();

  });

};