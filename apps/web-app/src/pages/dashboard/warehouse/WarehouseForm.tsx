/* eslint-disable */

import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function WarehouseForm({
  name,
  setName,
  location,
  setLocation,
  handleCreate,
  selectedWarehouse,
  setSelectedWarehouse,
  handleUpdate,
}: any) {
  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Create Warehouse</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 flex-wrap">

          <Input
            placeholder="Warehouse Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-xs"
          />

          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="max-w-xs"
          />

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!name || !location}
            onClick={handleCreate}
          >
            <Plus size={16} className="mr-2"/>
            Create
          </Button>

        </CardContent>
      </Card>

      {selectedWarehouse && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Warehouse Details</CardTitle>
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
      )}
    </>
  );
}