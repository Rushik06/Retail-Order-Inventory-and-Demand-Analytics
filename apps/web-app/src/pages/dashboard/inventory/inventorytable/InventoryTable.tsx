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

  {/* HEADER */}

  <CardHeader className="pb-2">
    <CardTitle className="text-xl font-semibold">
      Inventory Stock
    </CardTitle>
  </CardHeader>

  {/* TABLE */}

  <CardContent className="overflow-x-auto px-2">

    {loading ? (

      <div className="py-12 text-center text-muted-foreground">
        Loading inventory...
      </div>

    ) : (

      <Table className="min-w-full text-[15px]">

        {/* HEADER */}

        <InventoryTableHeader
          onSort={onSort}
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
        />

        {/* BODY */}

        <TableBody className="text-[15px]">

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

  {/* ACTION DIALOG */}

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