import {
  TableHead,
  TableRow,
  TableHeader
} from "@/components/ui/Table";

import { ArrowUpDown } from "lucide-react";
import { useAuthStore } from "@/app/app.state";   

interface Props {
  onSort?: (field: string) => void;
}

export default function InventoryTableHeader({
  onSort
}: Props) {

  const user = useAuthStore((state) => state.user);   

  const canSeeActions =
    user?.role === "admin" ||
    user?.role === "manager" ||
    user?.role === "super_admin";

  return (

    <TableHeader>

      <TableRow>

        {/* PRODUCT */}

        <TableHead
          className="w-[260px] cursor-pointer"
          onClick={() => onSort?.("product_id")}
        >
          <div className="flex items-center gap-2">
            Product
            <ArrowUpDown size={14} />
          </div>
        </TableHead>

        {/* WAREHOUSE */}

        <TableHead
          className="w-[260px] cursor-pointer"
          onClick={() => onSort?.("warehouse_id")}
        >
          <div className="flex items-center gap-2">
            Warehouse
            <ArrowUpDown size={14} />
          </div>
        </TableHead>

        {/* AVAILABLE */}

        <TableHead
          className="w-[120px] text-center cursor-pointer"
          onClick={() => onSort?.("available_qty")}
        >
          <div className="flex items-center justify-center gap-2">
            Available
            <ArrowUpDown size={14} />
          </div>
        </TableHead>

        {/* RESERVED */}

        <TableHead
          className="w-[120px] text-center cursor-pointer"
          onClick={() => onSort?.("reserved_qty")}
        >
          <div className="flex items-center justify-center gap-2">
            Reserved
            <ArrowUpDown size={14} />
          </div>
        </TableHead>

        {/* STATUS */}

        <TableHead className="w-[120px] text-center">
          Status
        </TableHead>

        {/* ACTIONS */}

        {canSeeActions && (
          <TableHead className="text-center w-[110px]">
            Actions
          </TableHead>
        )}

      </TableRow>

    </TableHeader>

  );
}