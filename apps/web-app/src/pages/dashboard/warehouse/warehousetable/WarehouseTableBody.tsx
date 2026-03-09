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

import type { WarehouseTableProps } from "@/types/warehouse.types";

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

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-white z-10">

        <TableRow>

          {/* NAME */}

          <TableHead
            className="cursor-pointer text-base font-semibold"
            onClick={() => handleSort("name")}
          >
            <div className="flex items-center gap-2">
              Name <ArrowUpDown size={16} />
            </div>
          </TableHead>

          {/* LOCATION */}

          <TableHead
            className="cursor-pointer text-base font-semibold"
            onClick={() => handleSort("location")}
          >
            <div className="flex items-center gap-2">
              Location <ArrowUpDown size={16} />
            </div>
          </TableHead>

          {/* STATUS */}
          <TableHead>Status</TableHead>

          {/* ACTIONS */}

          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {warehouses.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center py-8 text-gray-500"
            >
              No warehouses found
            </TableCell>
          </TableRow>

        ) : (
          warehouses.map((w) => (
            <TableRow key={w.warehouse_id}>
              {/* NAME */}
              <TableCell className="font-medium">
                {w.name}
              </TableCell>
              {/* LOCATION */}
              <TableCell>
                {w.location}
              </TableCell>
              {/* STATUS */}
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

              {/* ACTIONS */}

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


                  {/* ACTIVE to DEACTIVATE */}

                  {w.is_active ? (

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

                    /* INACTIVE to ACTIVATE */

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