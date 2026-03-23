import { createApiClient } from "./api-client";

/* CREATE API CLIENT */

const reportingAxios = createApiClient(import.meta.env.VITE_API_URL);

export default reportingAxios;


/* REPORTING APIs */


/* DASHBOARD */

export const getDashboard = () =>
  reportingAxios.get("/reports/dashboard");


/* COUNTERS */

export const getCounters = () =>
  reportingAxios.get("/reports/counters");


/* CHARTS */

export const getCharts = () =>
  reportingAxios.get("/reports/charts");


/* TABLES */

export const getTables = () =>
  reportingAxios.get("/reports/tables");


/* EXPORT PDF */

export const exportPDF = () =>
  reportingAxios.get("/reports/export/pdf", {
    responseType: "blob",
  });


/* EXPORT EXCEL */

export const exportExcel = () =>
  reportingAxios.get("/reports/export/excel", {
    responseType: "blob",
  });


/* EXPORT EMAIL */

export const exportReportEmail = (data: {
  email: string;
}) =>
  reportingAxios.post("/reports/export/email", data);