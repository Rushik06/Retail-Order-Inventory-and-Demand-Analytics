import { Button } from "@/components/ui/Button";
import type { WarehouseTableProps } from "@/types/warehouse.types";

export default function WarehousePagination({
  page,
  totalPages,
  setPage,
}: WarehouseTableProps) {

  return (

    <div className="flex justify-between items-center mt-6">

      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>

    </div>

  );
}