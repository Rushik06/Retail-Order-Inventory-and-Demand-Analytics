import { useState } from "react";
import { toast } from "sonner";

import {
  deactivateExistingWarehouse,
  activateExistingWarehouse,
} from "@/app/inventory.logic";

type ActionType = "activate" | "deactivate";

export default function useWarehouseActionModal(
  reload: () => Promise<void>
) {

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [targetWarehouseId, setTargetWarehouseId] = useState<string | null>(null);

  /* OPEN MODAL */

  const openActionModal = (
    id: string,
    type: ActionType
  ) => {
    setTargetWarehouseId(id);
    setActionType(type);
    setActionModalOpen(true);
  };

  /* CONFIRM ACTION */

  const handleConfirmAction = async () => {

    if (!targetWarehouseId || !actionType) return;

    try {

      if (actionType === "deactivate") {
        await deactivateExistingWarehouse(targetWarehouseId);
        toast.success("Warehouse deactivated");
      }

      if (actionType === "activate") {
        await activateExistingWarehouse(targetWarehouseId);
        toast.success("Warehouse activated");
      }

      await reload();

    } catch {
      toast.error("Operation failed");
    }

    setActionModalOpen(false);
    setTargetWarehouseId(null);
    setActionType(null);
  };

  return {
    actionModalOpen,
    setActionModalOpen,
    actionType,
    openActionModal,
    handleConfirmAction,
  };
}