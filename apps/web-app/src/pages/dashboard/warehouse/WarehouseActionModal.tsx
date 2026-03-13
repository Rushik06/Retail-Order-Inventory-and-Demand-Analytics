import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/Button";

type Props = {
  actionModalOpen: boolean;
  setActionModalOpen: (open: boolean) => void;
  actionType: "activate" | "deactivate" | null;
  handleConfirmAction: () => void;
};

export default function WarehouseActionModal({
  actionModalOpen,
  setActionModalOpen,
  actionType,
  handleConfirmAction,
}: Props) {
  return (
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
  );
}