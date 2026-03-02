/* eslint-disable */
import type { Order } from "@/pages/dashboard/order/Order";

interface Props {
  loading: boolean;
  paginated: Order[];
  entries: number;
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getStatusStyle: (status: string) => string;
  onStatusChange: (id: string, status: string) => void;
}

export default function OrdersTableContent({
  loading,
  paginated,
  entries,
  page,
  totalPages,
  setPage,
  getStatusStyle,
  onStatusChange,
}: Props) {

  return (
    <>
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Order No</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Update</th>
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
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No orders found
                </td>
              </tr>
            ) : (
              paginated.map((order, index) => {
                const orderNumber = `ORD-${String(
                  (page - 1) * entries + index + 1
                ).padStart(4, "0")}`;

                return (
                  <tr key={order.id} className="border-t hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold">{orderNumber}</td>
                    <td className="px-6 py-4">{order.customerName}</td>

                    <td className="px-6 py-4 text-slate-600">
                      {order.OrderItems?.length ? (
                        order.OrderItems.map((item) => (
                          <div key={item.id}>
                            {item.Product?.name} × {item.quantity}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No items</span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      Rs{order.totalAmount.toLocaleString()}/-
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onStatusChange(order.id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-xs"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-3 border-t text-sm bg-slate-50">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}