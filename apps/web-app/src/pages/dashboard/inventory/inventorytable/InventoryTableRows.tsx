/* eslint-disable */

import {
  TableRow,
  TableCell
} from "@/components/ui/Table";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Props {
  inventory: any[];
  products: any[];
  warehouses: any[];
  openAction: (type: string, item: any) => void;
}

export default function InventoryTableRows({
  inventory,
  products,
  warehouses,
  openAction
}: Props) {

  const stockStatus = (available: number) => {

    if (available <= 10) {
      return <Badge variant="destructive">Low</Badge>;
    }

    if (available >= 100) {
      return <Badge className="bg-green-600">High</Badge>;
    }

    return <Badge variant="secondary">Normal</Badge>;
  };

  return (

    <>
      {inventory.map((item) => {

        const product = products.find(
          (p: any) => p.id === item.product_id
        );

        const warehouse = warehouses.find(
          (w: any) => w.warehouse_id === item.warehouse_id
        );

        return (

          <TableRow key={item.inventory_id}>

            <TableCell>
              {product
                ? `${product.sku} - ${product.name}`
                : item.product_id}
            </TableCell>

            <TableCell>
              {warehouse
                ? `${warehouse.name} - ${warehouse.location}`
                : item.warehouse_id}
            </TableCell>

            <TableCell>{item.available_qty}</TableCell>

            <TableCell>{item.reserved_qty}</TableCell>

            <TableCell>
              {stockStatus(item.available_qty)}
            </TableCell>

            <TableCell className="flex gap-2">

              <Button
                size="sm"
                onClick={() => openAction("add", item)}
              >
                Add
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => openAction("reserve", item)}
              >
                Reserve
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => openAction("release", item)}
              >
                Release
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => openAction("deduct", item)}
              >
                Deduct
              </Button>

            </TableCell>

          </TableRow>

        );
      })}
    </>

  );
}