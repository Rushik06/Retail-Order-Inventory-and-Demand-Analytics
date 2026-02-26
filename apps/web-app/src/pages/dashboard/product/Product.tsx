/* eslint-disable */
import { useEffect, useState } from "react";
import productApi from "@/api/product-axios";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.get("/products");
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId) {
      await productApi.patch(`/products/${editingId}`, payload);
    } else {
      await productApi.post("/products", payload);
    }

    setEditingId(null);
    setForm({
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
    });

    loadProducts();
  };

  const handleDelete = async (id: string) => {
    await productApi.delete(`/products/${id}`);
    loadProducts();
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setEditingId(product.id);
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Product Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage Product catalog & Inventory
        </p>
      </div>

      <ProductForm
        form={form}
        editingId={editingId}
        setForm={setForm}
        onSubmit={handleSubmit}
      />

      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </div>
  );
}