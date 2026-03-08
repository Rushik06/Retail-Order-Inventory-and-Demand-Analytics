/* eslint-disable */
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
interface Props {
  products: any[];
  warehouses: any[];
  productId: string;
  warehouseId: string;
  setProductId: (id: string) => void;
  setWarehouseId: (id: string) => void;
  onCreate: () => void;
}

export default function InventoryCreateCard({
  products,
  warehouses,
  productId,
  warehouseId,
  setProductId,
  setWarehouseId,
  onCreate
}: Props) {

  return (

    <Card>

      <CardHeader>
        <CardTitle>Create Inventory</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-6 items-end">

        {/* PRODUCT */}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Product
          </label>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 h-[40px] w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >

            <option value="">
              Select Product
            </option>

            {products.map((p: any) => (

              <option
                key={p.id}
                value={p.id}
                disabled={p.stock === 0}
              >
                {p.sku} - {p.name}
                {p.stock === 0 ? " (Out of stock)" : ""}
              </option>

            ))}

          </select>

        </div>

        {/* WAREHOUSE */}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Warehouse
          </label>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 h-[40px] w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
          >
            <option value="">
              Select Warehouse
            </option>

            {warehouses.map((w: any) => (
              <option
                key={w.warehouse_id}
                value={w.warehouse_id}
                disabled={!w.is_active}
              >
                {w.name} - {w.location}
                {!w.is_active ? " (Inactive)" : ""}
              </option>

            ))}

          </select>
        </div>

        {/* CREATE BUTTON */}

        <div className="flex items-end">
          <Button
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white h-[40px] w-full rounded-lg transition"
          >
            Create
          </Button>

        </div>
      </CardContent>
    </Card>

  );
}