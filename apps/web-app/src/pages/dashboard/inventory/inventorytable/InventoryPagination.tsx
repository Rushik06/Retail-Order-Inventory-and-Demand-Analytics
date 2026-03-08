/* eslint-disable */

interface Props {
  page: number;
  totalPages: number;
  setPage: (value: number | ((p: number) => number)) => void;
}

export default function InventoryPagination({
  page,
  totalPages,
  setPage
}: Props) {

  return (

    <div className="flex justify-between items-center px-4 py-3 border-t">

      <button
        className="border px-3 py-1 rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
      >
        Prev
      </button>

      <span className="text-sm text-muted-foreground">
        Page {page} / {totalPages}
      </span>

      <button
        className="border px-3 py-1 rounded disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </button>

    </div>

  );
}