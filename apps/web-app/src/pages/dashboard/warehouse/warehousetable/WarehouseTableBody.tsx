import { Eye, Power, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuthStore } from "@/app/app.state";
import type { WarehouseTableProps } from "@/types/warehouse.types";
import WarehouseTableSkeleton from "@/components/loaders/WarehouseSkeleton";

export default function WarehouseTableBody({
  warehouses,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  handleView,
  handleDeactivate,
  handleActivate,
}: WarehouseTableProps) {

  const user = useAuthStore((state) => state.user);

  const actionBtn =
    "h-9 w-9 p-0 flex items-center justify-center";

  const handleSort = (field: "name" | "location") => {

    if (sortField === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortOrder("ASC");
    }

  };

  const canManage =
    user?.role === "admin" ||
    user?.role === "manager" ||
    user?.role === "super_admin";

  return (
    <Table>

      <TableHeader className="sticky top-0 bg-white z-10">

        <TableRow>

          <TableHead
            className="cursor-pointer text-base font-semibold"
            onClick={() => handleSort("name")}
          >
            <div className="flex items-center gap-2">
              Name <ArrowUpDown size={16} />
            </div>
          </TableHead>

          <TableHead
            className="cursor-pointer text-base font-semibold"
            onClick={() => handleSort("location")}
          >
            <div className="flex items-center gap-2">
              Location <ArrowUpDown size={16} />
            </div>
          </TableHead>

          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>

        </TableRow>

      </TableHeader>

      <TableBody>

        {warehouses.length === 0 ? (

          <WarehouseTableSkeleton />

        ) : (

          warehouses.map((w) => (

            <TableRow key={w.warehouse_id}>

              <TableCell className="font-medium">
                {w.name}
              </TableCell>

              <TableCell>
                {w.location}
              </TableCell>

              <TableCell>
                {w.is_active ? (
                  <span className="text-green-600 font-medium">
                    Active
                  </span>
                ) : (
                  <span className="text-gray-500 font-medium">
                    Inactive
                  </span>
                )}
              </TableCell>

              <TableCell>

                <div className="flex items-center gap-3">

                  {/* VIEW */}

                  <Tooltip>

                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${actionBtn} border-blue-500 text-blue-600 hover:bg-blue-50`}
                        onClick={() =>
                          handleView(w.warehouse_id)
                        }
                      >
                        <Eye size={18} />
                      </Button>

                    </TooltipTrigger>

                    <TooltipContent>
                      View details and update warehouse details
                    </TooltipContent>

                  </Tooltip>

                  {/* ACTIVATE / DEACTIVATE */}

                  {canManage && (
                    w.is_active ? (

                      <Tooltip>

                        <TooltipTrigger asChild>

                          <Button
                            size="sm"
                            variant="outline"
                            className={`${actionBtn} border-green-500 text-green-600 hover:bg-green-50`}
                            onClick={() =>
                              handleDeactivate(w.warehouse_id)
                            }
                          >
                            <Power size={18} />
                          </Button>

                        </TooltipTrigger>

                        <TooltipContent>
                          Deactivate warehouse
                        </TooltipContent>

                      </Tooltip>

                    ) : (

                      <Tooltip>

                        <TooltipTrigger asChild>

                          <Button
                            size="sm"
                            variant="outline"
                            className={`${actionBtn} border-red-500 text-red-600 hover:bg-red-50`}
                            onClick={() =>
                              handleActivate(w.warehouse_id)
                            }
                          >
                            <Power size={18} />
                          </Button>

                        </TooltipTrigger>

                        <TooltipContent>
                          Activate warehouse
                        </TooltipContent>

                      </Tooltip>

                    )
                  )}

                </div>

              </TableCell>
            </TableRow>

          ))
        )}

      </TableBody>

    </Table>
  );
}