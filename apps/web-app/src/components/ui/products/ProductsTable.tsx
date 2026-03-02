/* eslint-disable */
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types/product.types";

interface Props {
  loading: boolean;
  paginated: Product[];
  entries: number;
  page: number;
  totalPages: number;
  confirmId: string | null;
  stockColor: (stock: number) => string;
  setConfirmId: (id: string | null) => void;
  handleEdit: (product: Product) => void;
  handleDeleteConfirm: () => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  toast: string;
  setToast: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductsTableContent({
  loading,
  paginated,
  entries,
  page,
  totalPages,
  confirmId,
  stockColor,
  setConfirmId,
  handleEdit,
  handleDeleteConfirm,
  setPage,
  toast,
}: Props) {
  return (
    <>
      {/* Table */}
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-slate-500 uppercase text-xs">
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
              [...Array(entries)].map((_, i) => (
                <tr key={i} className="border-t">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No products found
                </td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr key={product.id} className="border-t hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${stockColor(
                        product.stock
                      )}`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmId(product.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t bg-slate-50 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-white border disabled:opacity-40"
          >
            Previous
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-white border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h3 className="font-semibold mb-3">CONFIRM DELETE</h3>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}
    </>
  );
}