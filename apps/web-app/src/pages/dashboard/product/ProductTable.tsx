/* eslint-disable */
import { Pencil, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}

interface Props {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductsTable({
  products,
  loading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">
          Product Inventory
        </h2>
        <p className="text-sm text-slate-500">
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">SKU</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {product.sku}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {product.category}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    ₹ {product.price.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          product.stock > 20
                            ? "bg-emerald-100 text-emerald-700"
                            : product.stock > 5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {product.stock} in stock
                    </span>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-3">

                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}