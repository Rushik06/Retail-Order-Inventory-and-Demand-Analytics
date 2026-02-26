/* eslint-disable */

type Props = {
  form: any;
  editingId: string | null;
  setForm: (data: any) => void;
  onSubmit: (e: any) => void;
};

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
    !form.sku?.trim() ||
    !form.category?.trim() ||
    form.price === "" ||
    Number(form.price) <= 0 ||
    form.stock === "" ||
    Number(form.stock) < 0;

  return (
    <form
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

      {/* SKU */}
      <input
        placeholder="SKU"
        value={form.sku}
        onChange={(e) =>
          setForm({ ...form, sku: e.target.value })
        }
        className="h-11 border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Category */}
      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        className="h-11 border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

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

      {/* Button */}
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