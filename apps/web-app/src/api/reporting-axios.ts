import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
} from "../utils/token";

const reportingAxios = axios.create({
    baseURL: "/api",
    withCredentials: false,
});

/* ATTACH ACCESS TOKEN */

reportingAxios.interceptors.request.use((config) => {
    const token = getAccessToken();


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/* HANDLE TOKEN REFRESH */

reportingAxios.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {

            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const res = await axios.post("/api/auth/refresh", {
                    refreshToken,
                });

                setTokens(res.data.accessToken, refreshToken);

                originalRequest.headers.Authorization =
                    `Bearer ${res.data.accessToken}`;

                return reportingAxios(originalRequest);

            } catch {

                clearTokens();
                window.location.href = "/login";

            }
        }

        return Promise.reject(error);
    }
);

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