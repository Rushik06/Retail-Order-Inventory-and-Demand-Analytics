export interface Product {
  id: string;
  name: string;
}

export interface Warehouse {
  warehouse_id: string;
  name?: string;
  location?: string;
}

export interface InventoryActivity {
  product_id: string;
  warehouse_id: string;
  action_type: string;
  new_available_qty: number;
}

export interface InventoryActivityProps {
  data: InventoryActivity[];
  products: Product[];
  warehouses: Warehouse[];
}

export const getProductName = (
  products: Product[],
  id: string
): string =>
  products?.find((p) => p.id === id)?.name || "Unknown";

export const getWarehouse = (
  warehouses: Warehouse[],
  warehouseId: string
): Warehouse | undefined =>
  warehouses?.find((w) => w.warehouse_id === warehouseId);