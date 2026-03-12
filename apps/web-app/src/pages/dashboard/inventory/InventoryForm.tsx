/* eslint-disable */
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/app/app.state";
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

  const user = useAuthStore((state) => state.user);
  const canCreate =
    user?.role === "admin" ||
    user?.role === "manager" ||
    user?.role === "super_admin";

  if (!canCreate) return null;

  const productLabel =
    products.find((p) => p.id === productId)
      ? `${products.find((p) => p.id === productId)?.sku} - ${products.find((p) => p.id === productId)?.name}`
      : "";

  const warehouseLabel =
    warehouses.find((w) => w.warehouse_id === warehouseId)
      ? `${warehouses.find((w) => w.warehouse_id === warehouseId)?.name} - ${warehouses.find((w) => w.warehouse_id === warehouseId)?.location}`
      : "";

  const disabled = !productId || !warehouseId;

  return (

    <Card>

      <CardHeader>
        <CardTitle>Create Inventory</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-[1fr_1fr_200px] gap-6 items-end">

        {/* PRODUCT */}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Product
          </label>

          <div className="relative">
            <input
              list="products"
              className="h-11 w-full border border-gray-300 rounded-lg px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productLabel}
              placeholder="Search product..."
              onChange={(e) => {

                const selected = products.find(
                  (p) => `${p.sku} - ${p.name}` === e.target.value
                );

                if (selected) {
                  setProductId(selected.id);
                }

              }}
            />

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

          </div>

          <datalist id="products">

            {products.map((p: any) => (
              <option
                key={p.id}
                value={`${p.sku} - ${p.name}`}
                disabled={p.stock === 0}
              />

            ))}

          </datalist>

        </div>


        {/* WAREHOUSE */}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Warehouse
          </label>

          <div className="relative">

            <input
              list="warehouses"
              className="h-11 w-full border border-gray-300 rounded-lg px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={warehouseLabel}
              placeholder="Search warehouse..."
              onChange={(e) => {

                const selected = warehouses.find(
                  (w) => `${w.name} - ${w.location}` === e.target.value
                );

                if (selected) {
                  setWarehouseId(selected.warehouse_id);
                }

              }}
            />

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

          </div>

          <datalist id="warehouses">

            {warehouses.map((w: any) => (
              <option
                key={w.warehouse_id}
                value={`${w.name} - ${w.location}`}
                disabled={!w.is_active}
              />

            ))}

          </datalist>
        </div>


        {/* CREATE BUTTON */}

        <Button
          onClick={onCreate}
          disabled={disabled}
          className={`h-11 w-full rounded-lg ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Create
        </Button>

      </CardContent>
    </Card>

  );
}