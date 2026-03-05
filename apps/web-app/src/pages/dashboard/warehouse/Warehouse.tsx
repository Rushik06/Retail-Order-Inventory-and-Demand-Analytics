import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import {
fetchWarehouses,
fetchWarehouseById,
createNewWarehouse,
updateExistingWarehouse,
} from "@/app/inventory.logic";

import WarehouseForm from "./warehouseform/WarehouseForm";
import WarehouseTable from "./warehousetable/WarehouseTable";
import WarehouseActionModal from "./WarehouseActionModal";

import useWarehouseActionModal from "@/hooks/Warehousehooks";

import type { Warehouse } from "@/types/warehouse.types";

export default function WarehousePage() {

const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

const [name, setName] = useState("");
const [location, setLocation] = useState("");

/* SCROLL REF */

const detailsRef = useRef<HTMLDivElement | null>(null);

/* QUERY STATE */

const [search, setSearch] = useState("");
const [sortField, setSortField] = useState<"name" | "location">("name");
const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

const [page, setPage] = useState(1);
const [limit, setLimit] = useState(6);
const [totalPages, setTotalPages] = useState(1);

/* LOAD FROM BACKEND */

const loadWarehouses = async () => {
try {
const res = await fetchWarehouses({
page,
limit,
search,
sortField,
sortOrder,
});

  setWarehouses(res.data || []);
  setTotalPages(res.totalPages || 1);

} catch (error) {
  console.error("Failed to load warehouses:", error);
  toast.error("Failed to load warehouses");
}

};

useEffect(() => {
loadWarehouses();
}, [page, limit, search, sortField, sortOrder]);

/* CREATE */

const handleCreate = async () => {
try {
await createNewWarehouse(name, location);

  toast.success("Warehouse created");

  setName("");
  setLocation("");

  loadWarehouses();
} catch {
  toast.error("Failed to create warehouse");
}

};

/* VIEW */

const handleView = async (id: string) => {
try {
const data = await fetchWarehouseById(id);

  setSelectedWarehouse(data.data);

  setTimeout(() => {
    detailsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);

} catch {
  toast.error("Failed to fetch warehouse");
}

};

/* UPDATE */

const handleUpdate = async () => {

if (!selectedWarehouse) return;

try {
  await updateExistingWarehouse(selectedWarehouse.warehouse_id, {
    name: selectedWarehouse.name,
    location: selectedWarehouse.location,
  });

  toast.success("Warehouse updated");

  setSelectedWarehouse(null);

  loadWarehouses();

} catch {
  toast.error("Failed to update warehouse");
}

};

/* MODAL HOOK */

const {
actionModalOpen,
setActionModalOpen,
actionType,
openActionModal,
handleConfirmAction,
} = useWarehouseActionModal(loadWarehouses);

return (

<div className="p-8 space-y-8">

  <h1 className="text-3xl font-semibold tracking-tight">
    Warehouse Management
  </h1>

  {/* DETAILS FORM */}

  <div ref={detailsRef}>
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
  </div>

  {/* TABLE */}

  <WarehouseTable
    search={search}
    setSearch={setSearch}
    sortField={sortField}
    setSortField={setSortField}
    sortOrder={sortOrder}
    setSortOrder={setSortOrder}
    warehouses={warehouses}
    page={page}
    totalPages={totalPages}
    setPage={setPage}
    limit={limit}
    setLimit={setLimit}
    handleView={handleView}
    handleDeactivate={(id: string) =>
      openActionModal(id, "deactivate")
    }
    handleActivate={(id: string) =>
      openActionModal(id, "activate")
    }
  />

  {/* ACTION MODAL */}

  <WarehouseActionModal
    actionModalOpen={actionModalOpen}
    setActionModalOpen={setActionModalOpen}
    actionType={actionType}
    handleConfirmAction={handleConfirmAction}
  />

</div>

);
}