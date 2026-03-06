/* eslint-disable */

import {
TableRow,
TableCell
} from "@/components/ui/Table";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import {
Plus,
Lock,
Unlock,
Minus
} from "lucide-react";

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

        {/* PRODUCT */}

        <TableCell className="font-medium">
          {product
            ? `${product.sku} - ${product.name}`
            : item.product_id}
        </TableCell>

        {/* WAREHOUSE */}

        <TableCell>
          {warehouse
            ? `${warehouse.name} - ${warehouse.location}`
            : item.warehouse_id}
        </TableCell>

        {/* AVAILABLE */}

        <TableCell className="text-center">
          {item.available_qty}
        </TableCell>

        {/* RESERVED */}

        <TableCell className="text-center">
          {item.reserved_qty}
        </TableCell>

        {/* STATUS */}

        <TableCell className="text-center">
          {stockStatus(item.available_qty)}
        </TableCell>

        {/* ADD STOCK */}

        <TableCell className="text-center">
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => openAction("add", item)}
          >
            <Plus size={16} />
          </Button>
        </TableCell>

        {/* RESERVE STOCK */}

        <TableCell className="text-center">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => openAction("reserve", item)}
          >
            <Lock size={16} />
          </Button>
        </TableCell>

        {/* RELEASE STOCK */}

        <TableCell className="text-center">
          <Button
            size="icon"
            variant="outline"
            onClick={() => openAction("release", item)}
          >
            <Unlock size={16} />
          </Button>
        </TableCell>

        {/* DEDUCT STOCK */}

        <TableCell className="text-center">
          <Button
            size="icon"
            variant="destructive"
            onClick={() => openAction("deduct", item)}
          >
            <Minus size={16} />
          </Button>
        </TableCell>

      </TableRow>

    );
  })}
</>

);
}