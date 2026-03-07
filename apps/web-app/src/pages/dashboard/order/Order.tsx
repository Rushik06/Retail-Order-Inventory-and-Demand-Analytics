/* eslint-disable */
import { useEffect, useState } from "react";
import productApi from "@/api/product-axios";
import OrderForm from "./OrderForm";
import OrdersTable from "./OrderTable";
import type { Product, OrderItem } from "@/types/order.types";
import { toast } from "sonner";

export interface Order {
  id: string;
  customerName: string;
  status: string;
  totalAmount: number;
  OrderItems?: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    productId: "",
    quantity: 1,
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await productApi.get("/orders");
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await productApi.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const handleCreate = async () => {
    if (!form.customerName || !form.productId) {
      toast.warning("Customer name and product are required");
      return;
    }

    try {
      await productApi.post("/orders", {
        customerName: form.customerName,
        items: [
          {
            productId: form.productId,
            quantity: form.quantity,
          },
        ],
      });

      toast.success("Order created successfully");

      setForm({ customerName: "", productId: "", quantity: 1 });
      loadOrders();

    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await productApi.patch(`/orders/${id}/status`, { status });

      toast.success("Order status updated");

      loadOrders();

    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="space-y-8">
      <OrderForm
        form={form}
        setForm={setForm}
        products={products}
        onCreate={handleCreate}
      />

      <OrdersTable
        orders={orders}
        loading={loading}
        onStatusChange={updateStatus}
      />
    </div>
  );
}