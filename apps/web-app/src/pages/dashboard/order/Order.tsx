/* eslint-disable */
import { useEffect, useState } from "react";
import productApi from "@/api/product-axios";
import OrderForm from "./OrderForm";
import OrdersTable from "./OrderTable";

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  Product?: {
    id: string;
    name: string;
  };
}

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
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const res = await productApi.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadOrders();
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
    loadOrders();
  };

  const updateStatus = async (id: string, status: string) => {
    await productApi.patch(`/orders/${id}/status`, { status });
    loadOrders();
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