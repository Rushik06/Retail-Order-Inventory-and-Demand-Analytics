/* eslint-disable */
import {
  getAllInventory,
  getInventory,
  addStock,
  deductStock,
  reserveStock,
  releaseStock,
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deactivateWarehouse,
  activateWarehouse,
} from "../api/inventory-axios";


/* INVENTORY LOGIC */

// Get all inventory
export const fetchInventory = async () => {
  const res = await getAllInventory();
  return res.data;
};

// Get specific inventory
export const fetchInventoryByProductWarehouse = async (
  productId: string,
  warehouseId: string
) => {
  const res = await getInventory(productId, warehouseId);
  return res.data;
};

// Add stock (Inbound)
export const addInventoryStock = async (
  productId: string,
  warehouseId: string,
  quantity: number,
  referenceId?: string | null
) => {
  const res = await addStock({
    productId,
    warehouseId,
    quantity,
    referenceId,
  });

  return res.data;
};

// Deduct stock (Outbound)
export const deductInventoryStock = async (
  productId: string,
  warehouseId: string,
  quantity: number,
  referenceId: string
) => {
  const res = await deductStock({
    productId,
    warehouseId,
    quantity,
    referenceId,
  });

  return res.data;
};

// Reserve stock
export const reserveInventoryStock = async (
  productId: string,
  warehouseId: string,
  quantity: number
) => {
  const res = await reserveStock({
    productId,
    warehouseId,
    quantity,
  });

  return res.data;
};

// Release reserved stock
export const releaseInventoryStock = async (
  productId: string,
  warehouseId: string,
  quantity: number
) => {
  const res = await releaseStock({
    productId,
    warehouseId,
    quantity,
  });

  return res.data;
};


/* WAREHOUSE LOGIC */

// Create warehouse
export const createNewWarehouse = async (
  name: string,
  location: string
) => {
  const res = await createWarehouse({
    name,
    location,
  });

  return res.data;
};

// Get all warehouses
export const fetchWarehouses = async () => {
  const res = await getWarehouses();
  return res.data;
};

// Get warehouse by ID
export const fetchWarehouseById = async (id: string) => {
  const res = await getWarehouseById(id);
  return res.data;
};

// Update warehouse
export const updateExistingWarehouse = async (
  id: string,
  data: {
    name?: string;
    location?: string;
  }
) => {
  const res = await updateWarehouse(id, data);
  return res.data;
};

// Deactivate warehouse
export const deactivateExistingWarehouse = async (id: string) => {
  const res = await deactivateWarehouse(id);
  return res.data;
};

export const activateExistingWarehouse = async (id: string) => {
  const res = await activateWarehouse(id);
  return res.data;
};