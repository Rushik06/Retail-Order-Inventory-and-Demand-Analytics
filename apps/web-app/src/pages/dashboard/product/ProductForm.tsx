/* eslint-disable */
import { useMemo } from "react";
import type { Props } from "@/types/product.types";

const CATEGORY_OPTIONS = [
  "Electronics",
  "Fashion",
  "Groceries",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Beauty",
];

export default function ProductForm({
  form,
  editingId,
  setForm,
  onSubmit,
}: Props) {

  const priceInvalid =
    form.price !== "" && Number(form.price) <= 0;

  const stockInvalid =
    form.stock !== "" && Number(form.stock) < 0;

  const disabled =
    !form.name?.trim() ||
    !form.category?.trim() ||
    form.price === "" ||
    Number(form.price) <= 0 ||
    form.stock === "" ||
    Number(form.stock) < 0;

  /* SKU Preview */
  const previewSku = useMemo(() => {
    if (!form.category) return "SKU ";

    const prefix = form.category
      .slice(0, 4)
      .toUpperCase();

    return `${prefix}-AUTO`;
  }, [form.category]);

  return (
    <form
      id="product-form"
      onSubmit={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onSubmit(e);
      }}
      className="grid md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
    >

      {/* Name */}
      <input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="h-11 border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* SKU (Auto Generated) */}
      <input
        placeholder="SKU"
        value={editingId ? form.sku : previewSku}
        disabled
        className="h-11 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg px-4 cursor-not-allowed"
      />

      {/* Category Dropdown */}
      <select
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        className="h-11 border border-slate-200 rounded-lg px-4 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select Category</option>
        {CATEGORY_OPTIONS.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Price */}
      <div className="flex flex-col">
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className={`h-11 border rounded-lg px-4 focus:ring-2 focus:outline-none ${
            priceInvalid
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-200 focus:ring-blue-500"
          }`}
        />
        <div className="h-4 mt-1 text-xs">
          {priceInvalid && (
            <span className="text-red-500">
              Price must be greater than 0
            </span>
          )}
        </div>
      </div>

      {/* Stock */}
      <div className="flex flex-col">
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
          className={`h-11 border rounded-lg px-4 focus:ring-2 focus:outline-none ${
            stockInvalid
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-200 focus:ring-blue-500"
          }`}
        />
        <div className="h-4 mt-1 text-xs">
          {stockInvalid && (
            <span className="text-red-500">
              Stock cannot be negative
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled}
        className={`h-11 rounded-lg font-medium transition ${
          disabled
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {editingId ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}