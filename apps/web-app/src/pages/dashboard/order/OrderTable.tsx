/* eslint-disable */
import type { Order } from "./Order";

interface Props {
  orders: Order[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
}

export default function OrdersTable({
  orders,
  loading,
  onStatusChange,
}: Props) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      case "PROCESSING":
        return "bg-amber-100 text-amber-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

      {/* Table Header Section */}
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">
          Orders Overview
        </h2>
        <p className="text-sm text-slate-500">
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
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
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-400"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-400"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const orderNumber = `ORD-${String(index + 1).padStart(4, "0")}`;

                return (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {orderNumber}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {order.customerName}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {order.OrderItems?.length ? (
                        order.OrderItems.map((item) => (
                          <div key={item.id} className="leading-6">
                            {item.Product?.name} × {item.quantity}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">
                          No items
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">
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
                        className="border border-slate-200 rounded-lg px-3 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
    </div>
  );
}