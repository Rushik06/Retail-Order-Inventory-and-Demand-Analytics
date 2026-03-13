import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";

import {
  Table,
  TableBody
} from "@/components/ui/Table";
import InventoryTableRows from "./InventoryTableRows";
import InventoryActionDialog from "./InventoryActionDialog";
import InventoryTableHeader from "./InventoryTableHeaders";
import useInventoryActions from "@/hooks/Inventoryhooks";
import type { Props } from "@/types/inventory.types";
import InventoryPagination from "./InventoryPagination";

export default function InventoryTable({
  inventory,
  products,
  warehouses,
  loading,
  reload,
  addInventoryStock,
  reserveInventoryStock,
  releaseInventoryStock,
  deductInventoryStock,
  onSort,
  search,
  setSearch,
  limit,
  setLimit,
  page,
  setPage,
  totalPages
}: Props) {

  const {
    open,
    setOpen,
    quantity,
    setQuantity,
    action,
    openAction,
    confirmAction,
    orders,
    orderId,
    setOrderId
  } = useInventoryActions({
    reload,
    addInventoryStock,
    reserveInventoryStock,
    releaseInventoryStock,
    deductInventoryStock
  });

  return (

    <Card className="w-full">

      {/* HEADER */}

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle className="text-xl font-semibold">
          Inventory Stock
        </CardTitle>

        <div className="flex items-center gap-3">

          <input
            type="text"
            placeholder="Search product or warehouse..."
            className="border rounded-md px-3 py-2 w-[260px]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          <select
            className="border rounded-md px-3 py-2"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

        </div>

      </CardHeader>

      <CardContent className="px-4 pb-4">

        <div className="border rounded-lg overflow-hidden">

          <div className="max-h-[420px] overflow-y-auto">

            <Table className="w-full text-[15px]">

              {/* HEADER */}

              <InventoryTableHeader onSort={onSort} />

              {/* BODY */}

              <TableBody>

                {loading ? (
                  [...Array(6)].map((_, i) => (

                    <tr key={i} className="animate-pulse">
                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-[200px]" />
                      </td>

                      <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-[200px]" />
                      </td>

                      <td className="p-4 text-center">
                        <div className="h-4 bg-gray-200 rounded w-[40px] mx-auto" />
                      </td>

                      <td className="p-4 text-center">
                        <div className="h-4 bg-gray-200 rounded w-[40px] mx-auto" />
                      </td>

                      <td className="p-4 text-center">
                        <div className="h-4 bg-gray-200 rounded w-[60px] mx-auto" />
                      </td>

                      <td className="p-4 text-center">
                        <div className="h-4 bg-gray-200 rounded w-[20px] mx-auto" />
                      </td>
                    </tr>

                  ))

                ) : (

                  <InventoryTableRows
                    inventory={inventory}
                    products={products}
                    warehouses={warehouses}
                    openAction={openAction}
                  />

                )}

              </TableBody>
            </Table>
          </div>
          {/* PAGINATION */}

          <InventoryPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>

      </CardContent>

      <InventoryActionDialog
        open={open}
        setOpen={setOpen}
        quantity={quantity}
        setQuantity={setQuantity}
        confirmAction={confirmAction}
        orders={orders}
        orderId={orderId}
        setOrderId={setOrderId}
        action={action}
      />

    </Card>
  );
}