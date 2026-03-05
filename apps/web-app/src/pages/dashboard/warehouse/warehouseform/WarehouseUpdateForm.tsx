/* eslint-disable */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function WarehouseUpdateForm({
  selectedWarehouse,
  setSelectedWarehouse,
  handleUpdate,
}: any) {

  if (!selectedWarehouse) return null;

  return (

    <Card className="shadow-sm">

      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Warehouse Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 max-w-md">

        <Input
          value={selectedWarehouse.name}
          onChange={(e) =>
            setSelectedWarehouse({
              ...selectedWarehouse,
              name: e.target.value,
            })
          }
        />

        <Input
          value={selectedWarehouse.location}
          onChange={(e) =>
            setSelectedWarehouse({
              ...selectedWarehouse,
              location: e.target.value,
            })
          }
        />

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleUpdate}
        >
          Update Warehouse
        </Button>

      </CardContent>

    </Card>

  );
}