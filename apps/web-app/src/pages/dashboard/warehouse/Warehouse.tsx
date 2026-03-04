import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  fetchWarehouses,
  fetchWarehouseById,
  createNewWarehouse,
  updateExistingWarehouse,
  deactivateExistingWarehouse,
  activateExistingWarehouse,
} from "@/app/inventory.logic";

import WarehouseForm from "./WarehouseForm";
import WarehouseTable from "./WarehouseTable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/Button";

type Warehouse = {
  warehouse_id: string;
  name: string;
  location: string;
  is_active: boolean;
};

export default function WarehousePage() {

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "location">("name");

  const [page, setPage] = useState(1);
  const perPage = 6;

  /* MODAL STATE */

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | null>(null);
  const [targetWarehouseId, setTargetWarehouseId] = useState<string | null>(null);

  /* LOAD */

  const loadWarehouses = async () => {
    const data = await fetchWarehouses();
    setWarehouses(data.data || []);
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  /* FILTER */

  const filtered = warehouses.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  /* SORT */

  const sorted = [...filtered].sort((a, b) =>
    a[sortField].localeCompare(b[sortField])
  );

  /* PAGINATION */

  const paginated = sorted.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalPages = Math.ceil(sorted.length / perPage);

  /* CREATE */

  const handleCreate = async () => {
    await createNewWarehouse(name, location);
    toast.success("Warehouse created");
    setName("");
    setLocation("");
    loadWarehouses();
  };

  /* VIEW */

  const handleView = async (id: string) => {
    const data = await fetchWarehouseById(id);
    setSelectedWarehouse(data.data);
  };

  /* UPDATE */

  const handleUpdate = async () => {

    if (!selectedWarehouse) return;

    await updateExistingWarehouse(selectedWarehouse.warehouse_id, {
      name: selectedWarehouse.name,
      location: selectedWarehouse.location,
    });

    toast.success("Warehouse updated");
    setSelectedWarehouse(null);
    loadWarehouses();
  };

  /* OPEN MODAL */

  const openActionModal = (
    id: string,
    type: "activate" | "deactivate"
  ) => {
    setTargetWarehouseId(id);
    setActionType(type);
    setActionModalOpen(true);
  };

  /* CONFIRM ACTION */

  const handleConfirmAction = async () => {

    if (!targetWarehouseId || !actionType) return;

    if (actionType === "deactivate") {
      await deactivateExistingWarehouse(targetWarehouseId);
      toast.success("Warehouse deactivated");
    }

    if (actionType === "activate") {
      await activateExistingWarehouse(targetWarehouseId);
      toast.success("Warehouse activated");
    }

    setActionModalOpen(false);
    setTargetWarehouseId(null);
    setActionType(null);

    loadWarehouses();
  };

  return (

    <div className="p-8 space-y-8">

      <h1 className="text-3xl font-semibold tracking-tight">
        Warehouse Management
      </h1>

      <WarehouseForm
        name={name}
        setName={setName}
        location={location}
        setLocation={setLocation}
        handleCreate={handleCreate}
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        handleUpdate={handleUpdate}
      />

      <WarehouseTable
        search={search}
        setSearch={setSearch}
        setSortField={setSortField}
        paginated={paginated}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        handleView={handleView}
        handleDeactivate={(id: string) =>
          openActionModal(id, "deactivate")
        }
        handleActivate={(id: string) =>
          openActionModal(id, "activate")
        }
      />

      {/* ACTION MODAL */}

      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>

        <DialogContent>

          <DialogHeader>
            <DialogTitle>

              {actionType === "deactivate"
                ? "Deactivate Warehouse"
                : "Activate Warehouse"}

            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">

            {actionType === "deactivate"
              ? "Are you sure you want to deactivate this warehouse?"
              : "Are you sure you want to activate this warehouse?"}

          </p>

          <DialogFooter className="mt-4">

            <Button
              variant="outline"
              onClick={() => setActionModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className={
                actionType === "deactivate"
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
              onClick={handleConfirmAction}
            >
              Confirm
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}