/* eslint-disable */
import { useEffect, useState } from "react";
import productApi from "@/api/product-axios";
import OrderForm from "./OrderForm";
import OrdersTable from "./OrderTable";
import type { Product, OrderItem } from "@/types/order.types";

export interface Order {
  id: string;
  customerName: string;
  status: string;
  totalAmount: number;
  OrderItems?: OrderItem[];
}

export default function Orders() {

  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] = useState({
    customerName: "",
    productId: "",
    quantity: 1,
  });

  const loadProducts = async () => {
    const res = await productApi.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async () => {
    if (!form.customerName || !form.productId) return;

    await productApi.post("/orders", {
      customerName: form.customerName,
      items: [
        {
          productId: form.productId,
          quantity: form.quantity,
        },
      ],
    });

    setForm({ customerName: "", productId: "", quantity: 1 });
  };

  const updateStatus = async (id: string, status: string) => {
    await productApi.patch(`/orders/${id}/status`, { status });
  };

  return (
    <div className="space-y-8">
      <OrderForm
        form={form}
        setForm={setForm}
        products={products}
        onCreate={handleCreate}
      />

      {/* ✅ FIXED — Only pass what OrdersTable expects */}
      <OrdersTable
        onStatusChange={updateStatus}
      />
    </div>
  );
}