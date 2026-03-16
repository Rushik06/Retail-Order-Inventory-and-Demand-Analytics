import { createApiClient } from "./api-client";

const inventoryAxios = createApiClient(import.meta.env.VITE_API_URL);

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


// Add stock
export const addStock = (data: {
  productId: string;
  warehouseId: string;
  quantity: number;
  referenceId?: string | null;
}) =>
  inventoryAxios.post("/inventory/add", data);


// Deduct stock
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