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

import InventoryCreateCard from "./InventoryForm";
import InventoryTable from "./inventorytable/InventoryTable";

import {
  filterInventory,
  sortInventory
} from "@/utils/inventory.helpers";

export default function InventoryPage() {

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

  /* LOAD INVENTORY */
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

  /* LOAD PRODUCTS + WAREHOUSES */

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

  /* CREATE INVENTORY */
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

  /* SORT HANDLER */
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

  /* SEARCH FILTER */
  const filteredInventory = filterInventory(
    inventory,
    products,
    warehouses,
    search
  );
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Inventory Management
      </h1>

      {/* CREATE INVENTORY */}
      <InventoryCreateCard
        products={products}
        warehouses={warehouses}
        productId={productId}
        warehouseId={warehouseId}
        setProductId={setProductId}
        setWarehouseId={setWarehouseId}
        onCreate={createInventory}
      />

      {/* INVENTORY TABLE */}

      <InventoryTable
        inventory={filteredInventory}
        products={products}
        warehouses={warehouses}
        loading={loading}
        reload={loadInventory}
        addInventoryStock={addInventoryStock}
        reserveInventoryStock={reserveInventoryStock}
        releaseInventoryStock={releaseInventoryStock}
        deductInventoryStock={deductInventoryStock}
        onSort={handleSort}
        search={search}
        setSearch={setSearch}
        limit={limit}
        setLimit={(value) => {
          setPage(1);
          setLimit(value);
        }}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

    </div>
  );
}