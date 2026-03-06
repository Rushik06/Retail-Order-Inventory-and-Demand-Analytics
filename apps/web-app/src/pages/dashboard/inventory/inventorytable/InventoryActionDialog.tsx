/* eslint-disable */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;

  quantity: number;
  setQuantity: (value: number) => void;

  confirmAction: () => void;

  orders: any[];
  orderId: string;
  setOrderId: (id: string) => void;

  action: string;
}

export default function InventoryActionDialog({
  open,
  setOpen,
  quantity,
  setQuantity,
  confirmAction,
  orders,
  orderId,
  setOrderId,
  action
}: Props) {

  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Enter Quantity</DialogTitle>
        </DialogHeader>


        {/* ORDER DROPDOWN - FOR DEDUCT */}

        {action === "deduct" && (

          <select
            className="border rounded px-3 py-2 w-full mb-3"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          >

            <option value="">Select Order</option>

            {orders.map((order: any, index: number) => {

              const orderNumber =
                `ORD-${String(index + 1).padStart(4, "0")}`;

              return (

                <option
                  key={order.id}
                  value={order.id}
                >

                  {orderNumber} - {order.customerName}

                </option>

              );

            })}

          </select>

        )}


        {/* QUANTITY INPUT */}

        <input
          type="number"
          className="border rounded px-3 py-2 w-full"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
        />


        {/* FOOTER BUTTONS */}

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button onClick={confirmAction}>
            Confirm
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}