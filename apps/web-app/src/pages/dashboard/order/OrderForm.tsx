/* eslint-disable */
import { useState } from "react";

interface Props {
  form: any;
  setForm: any;
  products: any[];
  onCreate: () => Promise<void>;
}

export default function OrderForm({
  form,
  setForm,
  products,
  onCreate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const product = products.find(p => p.id === form.productId);
  const stockExceeded = product && form.quantity > product.stock;

  const disabled =
    !form.customerName ||
    !form.productId ||
    form.quantity <= 0 ||
    stockExceeded;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (disabled) return;

    try {
      setLoading(true);
      setError("");
      await onCreate();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Order Management
        </h1>
        <p className="text-sm text-slate-500">
          Create and manage customer orders
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid md:grid-cols-4 gap-4 items-start"
      >
        {/* Customer Name */}
        <input
          placeholder="Customer Name"
          value={form.customerName}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
          className="h-11 border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Product Select */}
        <select
          value={form.productId}
          onChange={(e) =>
            setForm({ ...form, productId: e.target.value })
          }
          className="h-11 border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id} disabled={p.stock === 0}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>

        {/* Quantity */}
        <div className="flex flex-col">
          <input
            type="number"
            min={1}
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
            className={`h-11 border rounded-lg px-4 focus:ring-2 focus:outline-none ${
              stockExceeded
                ? "border-red-300 focus:ring-red-500"
                : "border-slate-200 focus:ring-blue-500"
            }`}
          />

          <div className="h-4 mt-1 text-xs">
            {stockExceeded
              ? <span className="text-red-500">Exceeds stock</span>
              : product
              ? <span className="text-slate-500">Available: {product.stock}</span>
              : null}
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={disabled || loading}
          className={`h-11 rounded-lg font-medium transition ${
            disabled || loading
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}