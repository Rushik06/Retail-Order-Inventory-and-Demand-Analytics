import type { Props } from "@/types/dashboard.types";

import DashboardBarCharts from "./DashboardBarchart";
import DashboardPieCharts from "./DashboardPiechart";

export default function DashboardCharts({ charts }: Props) {

  return (

    <div className="space-y-8">

      <DashboardBarCharts charts={charts} />

      <DashboardPieCharts charts={charts} />

    </div>

  );

}