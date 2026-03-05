import { Eye, Power, ArrowUpDown, CheckCircle } from "lucide-react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/Table";

import { Button } from "@/components/ui/Button";

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

            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No warehouses found
              </TableCell>
            </TableRow>

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

                    <Button
                      size="sm"
                      variant="outline"
                      className={`${actionBtn} border-green-500 text-green-600 hover:bg-green-50`}
                      onClick={() => handleView(w.warehouse_id)}
                    >
                      <Eye size={18} />
                    </Button>

                    {w.is_active ? (

                      <Button
                        size="sm"
                        variant="outline"
                        className={`${actionBtn} border-orange-500 text-orange-600 hover:bg-orange-50`}
                        onClick={() => handleDeactivate(w.warehouse_id)}
                      >
                        <Power size={18} />
                      </Button>

                    ) : (

                      <Button
                        size="sm"
                        variant="outline"
                        className={`${actionBtn} border-blue-500 text-blue-600 hover:bg-blue-50`}
                        onClick={() => handleActivate(w.warehouse_id)}
                      >
                        <CheckCircle size={18} />
                      </Button>

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