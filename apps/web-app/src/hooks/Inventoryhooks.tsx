/* eslint-disable */

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getOrders } from "@/api/product-axios";

export default function useInventoryActions({
  reload,
  addInventoryStock,
  reserveInventoryStock,
  releaseInventoryStock,
  deductInventoryStock
}: any) {

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [action, setAction] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [orderId, setOrderId] = useState("");

  /* LOAD ORDERS */

  useEffect(() => {

    const loadOrders = async () => {

      try {

        const res = await getOrders();

        setOrders(res.data?.data || res.data || []);

      } catch {

        toast.error("Failed to load orders");

      }

    };

    loadOrders();

  }, []);

  /* OPEN ACTION */

  const openAction = (type: string, item: any) => {

    setAction(type);
    setSelectedItem(item);
    setQuantity(0);
    setOrderId("");
    setOpen(true);

  };

  /* CONFIRM ACTION */

  const confirmAction = async () => {

    if (!quantity || quantity <= 0) {
      toast.warning("Please enter a valid quantity");
      return;
    }

    const { product_id, warehouse_id } = selectedItem;

    try {

      if (action === "add") {
        await addInventoryStock(product_id, warehouse_id, quantity);
        toast.success("Stock added successfully");
      }

      if (action === "reserve") {
        await reserveInventoryStock(product_id, warehouse_id, quantity);
        toast.success("Stock reserved successfully");
      }

      if (action === "release") {
        await releaseInventoryStock(product_id, warehouse_id, quantity);
        toast.success("Reserved stock released");
      }

      if (action === "deduct") {

        if (!orderId) {
          toast.warning("Please select an order");
          return;
        }

        await deductInventoryStock(
          product_id,
          warehouse_id,
          quantity,
          orderId
        );

        toast.success("Stock deducted for order");

      }

      setOpen(false);
      reload();

    } catch {

      toast.error("Inventory action failed");

    }

  };

  return {
    open,
    setOpen,
    quantity,
    setQuantity,
    action,
    openAction,
    confirmAction,
    orders,
    orderId,
    setOrderId
  };

}