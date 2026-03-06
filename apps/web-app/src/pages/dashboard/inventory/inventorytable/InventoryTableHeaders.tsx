/* eslint-disable */

import {
TableHead,
TableRow,
TableHeader
} from "@/components/ui/Table";

import { ArrowUpDown } from "lucide-react";

interface Props {
onSort?: (field: string) => void;
search: string;
setSearch: (value: string) => void;
limit: number;
setLimit: (value: number) => void;
}

export default function InventoryTableHeader({
onSort,
search,
setSearch,
limit,
setLimit
}: Props) {

return (

<TableHeader>

  {/* SEARCH + ENTRIES ROW */}

  <TableRow>

    <TableHead colSpan={5}>

      <input
        type="text"
        placeholder="Search product or warehouse..."
        className="border rounded px-3 py-2 w-[260px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </TableHead>

    <TableHead colSpan={4} className="text-right">

      <select
        className="border rounded px-3 py-2"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      >
        <option value={6}>6</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>

    </TableHead>

  </TableRow>


  {/* COLUMN HEADERS */}

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

    {/* ADD STOCK */}

    <TableHead className="text-center w-[110px]">
      Add Stock
    </TableHead>

    {/* RESERVE STOCK */}

    <TableHead className="text-center w-[130px]">
      Reserve Stock
    </TableHead>

    {/* RELEASE STOCK */}

    <TableHead className="text-center w-[130px]">
      Release Stock
    </TableHead>

    {/* DEDUCT STOCK */}

    <TableHead className="text-center w-[120px]">
      Deduct Stock
    </TableHead>

  </TableRow>

</TableHeader>

);
}