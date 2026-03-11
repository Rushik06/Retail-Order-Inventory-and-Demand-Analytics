import {
  getDashboard,
  getCounters,
  getCharts,
  getTables,
  exportPDF,
  exportExcel,
  exportReportEmail,
} from "../api/reporting-axios";

/* DASHBOARD */

export const fetchDashboard = async () => {
  const res = await getDashboard();
  return res.data;
};


/* COUNTERS */

export const fetchCounters = async () => {
  const res = await getCounters();
  return res.data;
};


/* CHARTS */

export const fetchCharts = async () => {
  const res = await getCharts();
  return res.data;
};


/* TABLES */

export const fetchTables = async () => {
  const res = await getTables();
  return res.data;
};


/* EXPORT PDF */

export const exportDashboardPDF = async () => {

  const res = await exportPDF();

  const url = window.URL.createObjectURL(
    new Blob([res.data])
  );

  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "dashboard-report.pdf");

  document.body.appendChild(link);
  link.click();

};


/* EXPORT EXCEL */

export const exportDashboardExcel = async () => {

  const res = await exportExcel();

  const url = window.URL.createObjectURL(
    new Blob([res.data])
  );

  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "dashboard-report.xlsx");

  document.body.appendChild(link);
  link.click();

};


/* EXPORT EMAIL */

export const sendDashboardReportEmail = async (
  email: string
) => {

  const res = await exportReportEmail({
    email,
  });

  return res.data;

};