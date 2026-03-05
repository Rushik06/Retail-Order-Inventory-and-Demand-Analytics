import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import type { WarehouseTableProps } from "@/types/warehouse.types";

import WarehouseTableHeader from "./WarehouseTableHeader";
import WarehouseTableBody from "./WarehouseTableBody";
import WarehousePagination from "./WarehousePagination";

export default function WarehouseTable(props: WarehouseTableProps) {

  return (
    <Card className="shadow-sm">

      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-semibold">
          Warehouses
        </CardTitle>

        <WarehouseTableHeader {...props} />
      </CardHeader>

      <CardContent className="space-y-4">

        {/* SCROLLABLE TABLE CONTAINER */}
        <div className="border rounded-lg max-h-[420px] overflow-y-auto">

          <WarehouseTableBody {...props} />

        </div>

        <WarehousePagination {...props} />

      </CardContent>

    </Card>
  );
}