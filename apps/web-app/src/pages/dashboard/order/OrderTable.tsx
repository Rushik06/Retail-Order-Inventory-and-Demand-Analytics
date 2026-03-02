/* eslint-disable */
import { useEffect, useState } from "react";
import type { Order } from "./Order";
import OrdersTableContent from "@/components/ui/orders/OrderTable";
import orderApi from "@/api/product-axios";

interface Props {
  onStatusChange: (id: string, status: string) => void;
}

export default function OrdersTable({
  onStatusChange,
}: Props) {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderApi.get("/orders", {
        params: {
          page,
          limit: entries,
          search,
          status: statusFilter,
          sort: sortBy,
        },
      });

      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, entries, search, statusFilter, sortBy]);

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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col">

      {/* Filters */}
      <div className="px-6 py-4 border-b flex flex-wrap gap-3 items-center justify-between">

        <h2 className="text-lg font-semibold text-slate-800">
          Orders Overview
        </h2>

        <div className="flex flex-wrap gap-3">

          <input
            placeholder="Search customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 border rounded-lg text-sm"
          >
            <option value="">Sort</option>
            <option value="total_desc">Total High → Low</option>
            <option value="total_asc">Total Low → High</option>
            <option value="status_asc">Status A → Z</option>
            <option value="status_desc">Status Z → A</option>
          </select>

          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setPage(1);
            }}
            className="h-10 px-3 border rounded-lg text-sm"
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>

        </div>
      </div>

      <OrdersTableContent
        loading={loading}
        paginated={orders}
        entries={entries}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        getStatusStyle={getStatusStyle}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}