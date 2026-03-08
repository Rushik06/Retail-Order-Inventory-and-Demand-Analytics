import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import { TooltipProvider } from "@/components/ui/tooltip";

import type { WarehouseTableProps } from "@/types/warehouse.types";

import WarehouseTableHeader from "./WarehouseTableHeader";
import WarehouseTableBody from "./WarehouseTableBody";
import WarehousePagination from "./WarehousePagination";

export default function WarehouseTable(props: WarehouseTableProps) {

  return (

    <TooltipProvider delayDuration={200}>

      <Card className="shadow-sm border bg-white">

        {/* HEADER */}

        <CardHeader className="flex flex-row justify-between items-center">

          <CardTitle className="text-xl font-semibold tracking-tight">
            Warehouses
          </CardTitle>

          <WarehouseTableHeader {...props} />

        </CardHeader>


        {/* CONTENT */}

        <CardContent className="space-y-4">

          {/* TABLE CONTAINER */}

          <div
            className="
              border
              rounded-lg
              max-h-[420px]
              overflow-y-auto
              scrollbar-thin
              scrollbar-thumb-gray-300
              scrollbar-track-transparent
            "
          >

            {/* TABLE BODY */}

            <div className="min-w-full">

              <WarehouseTableBody {...props} />

            </div>

          </div>


          {/* PAGINATION */}

          <WarehousePagination {...props} />

        </CardContent>

      </Card>

    </TooltipProvider>

  );

}