import { Input } from "@/components/ui/Input";
import type { WarehouseTableProps } from "@/types/warehouse.types";

export default function WarehouseTableHeader({
  search,
  setSearch,
  setPage,
  limit,
  setLimit,
}: WarehouseTableProps) {

  return (
    <div className="flex items-center gap-4">

      <Input
        placeholder="Search warehouse..."
        className="w-64"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      <select
        value={limit}
        onChange={(e) => {
          setPage(1);
          setLimit(Number(e.target.value));
        }}
        className="border rounded-md px-2 py-1 text-sm"
      >
        <option value={6}>6</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>

    </div>
  );
}