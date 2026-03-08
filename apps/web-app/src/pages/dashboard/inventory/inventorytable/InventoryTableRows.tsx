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
  Minus,
  MoreVertical
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/DropdownMenu";

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

            {/* ACTION MENU */}

            <TableCell className="text-center">

              <DropdownMenu>

                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                  <DropdownMenuItem
                    onClick={() => openAction("add", item)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Stock
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => openAction("reserve", item)}
                    className="flex items-center gap-2"
                  >
                    <Lock size={16} />
                    Reserve Stock
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => openAction("release", item)}
                    className="flex items-center gap-2"
                  >
                    <Unlock size={16} />
                    Release Stock
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => openAction("deduct", item)}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <Minus size={16} />
                    Deduct Stock
                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            </TableCell>
          </TableRow>
        );

      })}
    </>

  );
}