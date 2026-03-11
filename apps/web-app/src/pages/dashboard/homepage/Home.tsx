import { useEffect, useState } from "react";
import { fetchDashboard } from "@/app/reporting.logic";
import { useAuthStore } from "@/app/app.state"

import DashboardHeader from "@/pages/dashboard/homepage/DashboardHeader";
import DashboardCounters from "@/pages/dashboard/homepage/DashboardCounters";
import DashboardCharts from "@/pages/dashboard/homepage/DashboardCharts";
import InventoryActivityTable from "@/pages/dashboard/homepage/ActivityTable";
import RecentOrdersTable from "@/pages/dashboard/homepage/RecentOrdersTable";

export default function Home() {
/*eslint-disable @typescript-eslint/no-explicit-any */
  const [dashboard, setDashboard] = useState<any>(null);

  /* GET USER FROM ZUSTAND */
  const user = useAuthStore((state) => state.user);

  useEffect(() => {

    const loadDashboard = async () => {
      const data = await fetchDashboard();
      setDashboard(data);
    };

    loadDashboard();

  }, []);

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  const { counters, charts, tables } = dashboard;

  return (

    <div className="max-w-[1400px] mx-auto px-6 space-y-10">

      {/* PASS USER FROM STORE */}
      {user && <DashboardHeader user={user} />}

      <DashboardCounters counters={counters} />

      <DashboardCharts charts={charts} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryActivityTable data={tables.recentActivity} />
        <RecentOrdersTable data={tables.recentOrders} />
      </div>

    </div>

  );
}