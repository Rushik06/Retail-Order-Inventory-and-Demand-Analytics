/* eslint-disable */
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/token";

const inventoryAxios = axios.create({
  baseURL: "/api",
  withCredentials: false,
});

// Attach Access Token Automatically
inventoryAxios.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle Token Refresh
inventoryAxios.interceptors.response.use(
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

        return inventoryAxios(originalRequest);

      } catch {
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default inventoryAxios;


/* INVENTORY APIs */


//Get all inventory 

export const getAllInventory = (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}) =>
  inventoryAxios.get("/inventory", {
    params,
  });
// Get specific inventory
export const getInventory = (
  productId: string,
  warehouseId: string
) =>
  inventoryAxios.get(`/inventory/${productId}/${warehouseId}`);


// Create inventory
export const createInventory = (data: {
  productId: string;
  warehouseId: string;
  availableQty: number;
  reservedQty?: number;
}) =>
  inventoryAxios.post("/inventory/create", data);


// Add stock (Inbound)
export const addStock = (data: {
  productId: string;
  warehouseId: string;
  quantity: number;
  referenceId?: string | null;
}) =>
  inventoryAxios.post("/inventory/add", data);


// Deduct stock (Outbound)
export const deductStock = (data: {
  productId: string;
  warehouseId: string;
  quantity: number;
  referenceId: string;
}) =>
  inventoryAxios.post("/inventory/deduct", data);


// Reserve stock
export const reserveStock = (data: {
  productId: string;
  warehouseId: string;
  quantity: number;
}) =>
  inventoryAxios.post("/inventory/reserve", data);


// Release reserved stock
export const releaseStock = (data: {
  productId: string;
  warehouseId: string;
  quantity: number;
}) =>
  inventoryAxios.post("/inventory/release", data);



/* WAREHOUSE APIs */


// Create warehouse
export const createWarehouse = (data: {
  name: string;
  location: string;
}) =>
  inventoryAxios.post("/warehouse", data);


// Get all warehouses
export const getWarehouses = (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}) =>
  inventoryAxios.get("/warehouse", {
    params,
  });


// Get warehouse by ID
export const getWarehouseById = (id: string) =>
  inventoryAxios.get(`/warehouse/${id}`);


// Update warehouse
export const updateWarehouse = (
  id: string,
  data: {
    name?: string;
    location?: string;
  }
) =>
  inventoryAxios.patch(`/warehouse/${id}`, data);


// Deactivate warehouse
export const deactivateWarehouse = (id: string) =>
  inventoryAxios.patch(`/warehouse/${id}/deactivate`);


// Activate warehouse
export const activateWarehouse = (id: string) =>
  inventoryAxios.patch(`/warehouse/${id}/activate`);