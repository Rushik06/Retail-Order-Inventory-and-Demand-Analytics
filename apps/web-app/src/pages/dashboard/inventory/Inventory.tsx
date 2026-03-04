/* eslint-disable */

import { useEffect, useState } from "react";

import {
  fetchInventory,
  addInventoryStock,
  reserveInventoryStock,
  deductInventoryStock
} from "@/app/inventory.logic";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody
} from "@/components/ui/Table";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function InventoryPage() {

  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    const data = await fetchInventory();
    setInventory(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const stockStatus = (available: number) => {
    if (available <= 10) {
      return <Badge variant="destructive">Low Stock</Badge>;
    }

    if (available >= 100) {
      return <Badge className="bg-green-600">High Stock</Badge>;
    }

    return <Badge variant="secondary">Normal</Badge>;
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">Inventory Management</h1>

      <Card className="shadow rounded-xl">

        <CardHeader>
          <CardTitle>Inventory Stock</CardTitle>
        </CardHeader>

        <CardContent>

          {loading ? (
            <p>Loading...</p>
          ) : (

            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {inventory.map((item) => (

                  <TableRow key={item.inventory_id}>

                    <TableCell>
                      {item.product_id}
                    </TableCell>

                    <TableCell>
                      {item.warehouse_id}
                    </TableCell>

                    <TableCell>
                      {item.available_qty}
                    </TableCell>

                    <TableCell>
                      {item.reserved_qty}
                    </TableCell>

                    <TableCell>
                      {stockStatus(item.available_qty)}
                    </TableCell>

                    <TableCell className="flex gap-2">

                      <Button
                        size="sm"
                        onClick={() =>
                          addInventoryStock(
                            item.product_id,
                            item.warehouse_id,
                            10
                          )
                        }
                      >
                        Add
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          reserveInventoryStock(
                            item.product_id,
                            item.warehouse_id,
                            5
                          )
                        }
                      >
                        Reserve
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          deductInventoryStock(
                            item.product_id,
                            item.warehouse_id,
                            2,
                            "manual"
                          )
                        }
                      >
                        Deduct
                      </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          )}

        </CardContent>

      </Card>

    </div>
  );
}