import { useEffect, useState } from "react";
import { fetchDashboard } from "@/app/reporting.logic";
import { getProducts } from "@/api/product-axios";
import { getWarehouses } from "@/api/inventory-axios";
import { useAuthStore } from "@/app/app.state";
import DashboardHeader from "@/pages/dashboard/homepage/DashboardHeader";
import DashboardCounters from "@/pages/dashboard/homepage/DashboardCounters";
import DashboardCharts from "@/pages/dashboard/homepage/dashboardcharts/DashboardCharts";
import InventoryActivityTable from "@/pages/dashboard/homepage/ActivityTable";
import RecentOrdersTable from "@/pages/dashboard/homepage/RecentOrdersTable";
import type { DashboardData } from "@/types/dashboard.types";
import type { Order } from "@/utils/recentorder-table.helpers";
import type { InventoryActivity } from "@/utils/activity-table.helpers";

export default function Home() {

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {

    const loadDashboard = async () => {

      const dashboardData = await fetchDashboard();
      const productsRes = await getProducts();
      const warehousesRes = await getWarehouses({ limit: 100 });

      setDashboard({
        ...dashboardData,
        products: productsRes.data,
        warehouses: warehousesRes.data.data
      });

    };

    loadDashboard();

  }, []);

  if (!dashboard) {
    return (

      <div className="max-w-[1400px] mx-auto px-6 space-y-10 animate-pulse">

        {/* Header Skeleton */}
        <div className="h-10 w-64 bg-slate-200 rounded"></div>

        {/* Counters Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-200 rounded-lg"
            />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="h-[340px] bg-slate-200 rounded-lg"></div>
          <div className="h-[340px] bg-slate-200 rounded-lg"></div>

        </div>

        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="h-[320px] bg-slate-200 rounded-lg"></div>
          <div className="h-[320px] bg-slate-200 rounded-lg"></div>

        </div>

      </div>

    );
  }

  const { counters, charts, tables, products, warehouses } = dashboard;

  return (

    <div className="max-w-[1400px] mx-auto px-6 space-y-10">

      {user && <DashboardHeader user={user} />}

      <DashboardCounters counters={counters} />

      <DashboardCharts charts={charts} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <InventoryActivityTable
          data={tables.recentActivity as InventoryActivity[]}
          products={products}
          warehouses={warehouses}
        />

        <RecentOrdersTable
          data={tables.recentOrders as Order[]}
          products={products}
        />

      </div>

    </div>

  );
}