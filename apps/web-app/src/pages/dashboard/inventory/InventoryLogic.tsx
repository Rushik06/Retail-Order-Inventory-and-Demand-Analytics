/* eslint-disable */
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

import { filterInventory, sortInventory } from "@/utils/inventory.helpers";

export default function useInventoryPageLogic() {

  const queryClient = useQueryClient();

  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  /* INVENTORY QUERY */

  const {
    data: inventoryRes,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ["inventory", page, limit, search, sortField, sortOrder],
    queryFn: () =>
      fetchInventory({
        page,
        limit,
        search,
        sortField,
        sortOrder
      }),
  });

  const inventory = inventoryRes?.data || [];
  const totalPages = inventoryRes?.meta?.totalPages || 1;

  /* PRODUCTS QUERY */

  const { data: productsRes } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });

  const products = productsRes?.data || [];

  /* WAREHOUSES QUERY */

  const { data: warehousesRes } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () =>
      getWarehouses({
        page: 1,
        limit: 1000
      })
  });

  const warehouses = warehousesRes?.data?.data || [];

  /* HELPERS */

  const getAllocatedStock = (pid: string) => {
    return inventory
      .filter((i: any) => i.product_id === pid)
      .reduce((sum: number, i: any) => sum + (i.available_qty || 0), 0);
  };

  const getRemainingStock = (pid: string) => {

    const product = products.find((p: any) => p.id === pid);

    if (!product) return 0;

    const allocated = getAllocatedStock(pid);

    return Math.max(product.stock - allocated, 0);

  };

  /* CREATE INVENTORY MUTATION */

  const createMutation = useMutation({
    mutationFn: () => createNewInventory(productId, warehouseId, 0),

    onSuccess: () => {
      toast.success("Inventory created successfully");

      setProductId("");
      setWarehouseId("");

      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },

    onError: () => {
      toast.error("Failed to create inventory");
    }
  });

  const createInventory = async () => {

    if (!productId || !warehouseId) {
      toast.warning("Please select product and warehouse");
      return;
    }

    const exists = inventory.find(
      (i: any) =>
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

    createMutation.mutate();

  };

  /* ADD STOCK */

  const safeAddInventoryStock = async (
    productId: string,
    warehouseId: string,
    quantity: number,
    referenceId?: string | null
  ) => {

    const remaining = getRemainingStock(productId);

    if (quantity > remaining) {
      toast.error(`Only ${remaining} stock remaining to allocate`);
      return false;
    }

    await addInventoryStock(productId, warehouseId, quantity, referenceId ?? null);

    queryClient.invalidateQueries({ queryKey: ["inventory"] });

    return true;

  };

  /* SORT */

  const handleSort = (field: string) => {

    if (field === "product_id" || field === "warehouse_id") {

      const sorted = sortInventory(
        inventory,
        products,
        warehouses,
        field
      );

      queryClient.setQueryData(["inventory"], sorted);

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
    loadInventory: refetch,
    createInventory,
    safeAddInventoryStock,
    reserveInventoryStock,
    releaseInventoryStock,
    deductInventoryStock,
    handleSort
  };
}