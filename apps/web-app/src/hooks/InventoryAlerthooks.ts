/* eslint-disable */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getProducts } from "@/api/product-axios";
import { getWarehouses } from "@/api/inventory-axios";

interface Alert {
  id: string;
  productName: string;
  sku: string;
  warehouseName: string;
  location: string;
  qty: number;
}

export default function useInventoryAlerts() {

  const STORAGE_KEY = "inventory_alerts";

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  /* SAVE ALERTS */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  /* LOAD PRODUCTS + WAREHOUSES */

  useEffect(() => {

    const loadData = async () => {

      try {

        const productRes = await getProducts();
        setProducts(productRes.data || []);

        const warehouseRes = await getWarehouses({
          page: 1,
          limit: 1000
        });

        setWarehouses(warehouseRes.data?.data || []);

      } catch (err) {

        console.error("Failed loading alert metadata", err);

      }

    };

    loadData();

  }, []);

  /* SOCKET CONNECTION */

  useEffect(() => {

    if (!products.length || !warehouses.length) return;

    const socket = io("http://localhost:3002", {
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      console.log("Inventory socket connected");
    });

    socket.on("inventory.low_stock", (event) => {

      const product = products.find((p) => p.id === event.productId);

      const warehouse = warehouses.find(
        (w) => w.warehouse_id === event.warehouseId
      );

      const alertId = `${event.productId}_${event.warehouseId}`;

      /* STOCK NORMAL → REMOVE ALERT */

      if (event.currentQty > event.threshold) {

        setAlerts((prev) =>
          prev.filter((a) => a.id !== alertId)
        );

        return;

      }

      const alert: Alert = {

        id: alertId,

        productName: product
          ? `${product.sku} - ${product.name}`
          : event.productId,

        sku: product?.sku || "",

        warehouseName: warehouse
          ? warehouse.name
          : event.warehouseId,

        location: warehouse?.location || "",

        qty: event.currentQty

      };

      setAlerts((prev) => {

        const exists = prev.find((a) => a.id === alertId);

        if (exists) {
          return prev.map((a) =>
            a.id === alertId ? alert : a
          );
        }

        return [alert, ...prev];

      });

    });

    return () => {socket.disconnect()};

  }, [products, warehouses]);

  return alerts;

}