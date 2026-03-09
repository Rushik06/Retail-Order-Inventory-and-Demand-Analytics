/* eslint-disable */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchInventory,
  createNewInventory,
  addInventoryStock,
  reserveInventoryStock,
  releaseInventoryStock,
  deductInventoryStock
} from "@/app/inventory.logic";

import { getProducts } from "@/api/product-axios";
import { getWarehouses } from "@/api/inventory-axios";

import {
  filterInventory,
  sortInventory
} from "@/utils/inventory.helpers";

export default function useInventoryPageLogic() {

  const [inventory, setInventory] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [totalPages, setTotalPages] = useState(1);

  const getAllocatedStock = (pid: string) => {
    return inventory
      .filter((i) => i.product_id === pid)
      .reduce((sum, i) => sum + (i.available_qty || 0), 0);
  };

  const getRemainingStock = (pid: string) => {

    const product = products.find((p) => p.id === pid);

    if (!product) return 0;

    const allocated = getAllocatedStock(pid);

    return Math.max(product.stock - allocated, 0);
  };

  const loadInventory = async () => {

    setLoading(true);

    try {

      const res = await fetchInventory({
        page,
        limit,
        search,
        sortField,
        sortOrder
      });

      setInventory(res.data || []);

      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
      }

    } catch (err) {

      console.error("Inventory load failed", err);
      toast.error("Failed to load inventory");

    }

    setLoading(false);

  };

  const loadDropdowns = async () => {

    try {

      const productRes = await getProducts();
      setProducts(productRes.data || []);

      const warehouseRes = await getWarehouses({
        page: 1,
        limit: 1000
      });

      setWarehouses(warehouseRes.data?.data || []);

    } catch {

      toast.error("Failed to load products or warehouses");

    }

  };

  useEffect(() => {
    loadInventory();
  }, [page, limit, search, sortField, sortOrder]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  const createInventory = async () => {

    if (!productId || !warehouseId) {

      toast.warning("Please select product and warehouse");
      return;

    }

    const exists = inventory.find(
      (i) =>
        i.product_id === productId &&
        i.warehouse_id === warehouseId
    );

    if (exists) {

      toast.error("Inventory already exists for this product and warehouse");
      return;

    }

    const remaining = getRemainingStock(productId);

    if (remaining <= 0) {

      toast.error("All product stock already allocated across warehouses");
      return;

    }

    try {

      await createNewInventory(productId, warehouseId, 0);

      toast.success("Inventory created successfully");

      setProductId("");
      setWarehouseId("");

      await loadInventory();

    } catch {
      toast.error("Failed to create inventory");

    }

  };

  const safeAddInventoryStock = async (
    productId: string,
    warehouseId: string,
    quantity: number,
    referenceId?: string | null
  ) => {

    const remaining = getRemainingStock(productId);

    if (quantity > remaining) {

      toast.error(`Only ${remaining} stock remaining to allocate`);
      return;

    }

    await addInventoryStock(productId, warehouseId, quantity, referenceId ?? null);
    await loadInventory();

  };

  const handleSort = (field: string) => {

    if (field === "product_id" || field === "warehouse_id") {

      const sorted = sortInventory(
        inventory,
        products,
        warehouses,
        field
      );

      setInventory(sorted);
      return;

    }

    if (sortField === field) {

      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");

    } else {

      setSortField(field);
      setSortOrder("ASC");

    }

  };

  const filteredInventory = filterInventory(
    inventory,
    products,
    warehouses,
    search
  );

  return {
    inventory: filteredInventory,
    products,
    warehouses,
    productId,
    warehouseId,
    setProductId,
    setWarehouseId,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    totalPages,
    loadInventory,
    createInventory,
    safeAddInventoryStock,
    reserveInventoryStock,
    releaseInventoryStock,
    deductInventoryStock,
    handleSort
  };

}