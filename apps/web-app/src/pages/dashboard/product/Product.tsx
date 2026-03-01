/*eslint-disable*/ 
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import productApi from "@/api/product-axios";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import type { Product } from "@/types/product.types";

export default function Products() {

  /* State */
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  /* Load Products */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* Submit */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
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

      await loadProducts();

    } catch (error) {
      console.error("Product save failed");
    }
  };

  /* Delete */
  const handleDelete = async (id: string) => {
    try {
      await productApi.delete(`/products/${id}`);
      await loadProducts();
    } catch (error) {
      console.error("Delete failed");
    }
  };

  /* Edit */
  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
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