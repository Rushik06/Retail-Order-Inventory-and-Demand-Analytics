/* eslint-disable */

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

interface Props {
  inventory: any[];
  products: any[];
  warehouses: any[];
  loading: boolean;
  reload: () => void;

  addInventoryStock: any;
  reserveInventoryStock: any;
  releaseInventoryStock: any;
  deductInventoryStock: any;

  onSort?: (field: string) => void;

  search: string;
  setSearch: (value: string) => void;

  limit: number;
  setLimit: (value: number) => void;
}

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
  setLimit

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

      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Inventory Stock
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">

        {loading ? (

          <div className="py-10 text-center text-muted-foreground">
            Loading inventory...
          </div>

        ) : (

          <Table className="min-w-full">

            <InventoryTableHeader
              onSort={onSort}
              search={search}
              setSearch={setSearch}
              limit={limit}
              setLimit={setLimit}
            />

            <TableBody className="text-sm">

              <InventoryTableRows
                inventory={inventory}
                products={products}
                warehouses={warehouses}
                openAction={openAction}
              />

            </TableBody>

          </Table>

        )}

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