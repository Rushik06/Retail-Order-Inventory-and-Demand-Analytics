import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import productApi from "@/api/product-axios";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import type { Product } from "@/types/product.types";
import { toast } from "sonner";

export default function Products() {

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

  /* Helper for error message */
  const getErrorMessage = (err: unknown, fallback: string) => {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err
    ) {
      const res = err as {
        response?: { data?: { message?: string } };
      };

      return res.response?.data?.message || fallback;
    }

    return fallback;
  };

  /* Load Products */
  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await productApi.get("/products");
      setProducts(res.data);

    } catch (err: unknown) {

      const message = getErrorMessage(err, "Failed to load products");
      console.error(message);
      toast.error(message);

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
        toast.success("Product updated successfully");
      } else {
        await productApi.post("/products", payload);
        toast.success("Product created successfully");
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

    } catch (err: unknown) {

      const message = getErrorMessage(err, "Product save failed");
      console.error(message);
      toast.error(message);

    }
  };

  /* Delete */
  const handleDelete = async (id: string) => {
    try {

      await productApi.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      await loadProducts();

    } catch (err: unknown) {

      const message = getErrorMessage(err, "Product delete failed");
      console.error(message);
      toast.error(message);

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

    toast.info("Editing product");
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