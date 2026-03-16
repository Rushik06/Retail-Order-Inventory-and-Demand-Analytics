import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getProducts } from "@/api/product-axios";
import { getWarehouses } from "@/api/inventory-axios";
import { useAuthStore } from "@/app/app.state";
import type { Product,Warehouse } from "@/types/inventoryalert.types";

interface Alert {
  id: string;
  productName: string;
  sku: string;
  warehouseName: string;
  location: string;
  qty: number;
}

export default function useInventoryAlerts() {

  const user = useAuthStore((s) => s.user);
  const STORAGE_KEY = "inventory_alerts";

  const SOCKET_URL = import.meta.env.VITE_INVENTORY_SOCKET_URL;

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  /* SAVE ALERTS */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  /* LOAD PRODUCTS + WAREHOUSES ONLY IF USER LOGGED IN */

  useEffect(() => {

    if (!user) return;

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

  }, [user]);

  /* SOCKET CONNECTION */

  useEffect(() => {

    if (!user) return;
    if (!products.length || !warehouses.length) return;

    const socket = io(SOCKET_URL, {
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

    return () => {
      socket.disconnect();
    };

  }, [user, products, warehouses]);

  return alerts;

}