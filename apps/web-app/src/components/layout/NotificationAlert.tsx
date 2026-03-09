import { useState } from "react";
import { BellRing, AlertTriangle } from "lucide-react";
import useInventoryAlerts from "@/hooks/InventoryAlerthooks";

export default function InventoryAlerts() {

  const alerts = useInventoryAlerts();
  const [open, setOpen] = useState(false);

  return (

    <div className="relative">

      {/* Notification Button */}

      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center h-10 w-10 rounded-lg hover:bg-slate-100 transition"
      >

        <BellRing size={20} className="text-slate-700" />

        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-semibold rounded-full">
            {alerts.length}
          </span>
        )}

      </button>

      {/* Dropdown Panel */}

      {open && (

        <div className="absolute right-0 mt-3 w-[360px] bg-white border border-slate-200 rounded-xl shadow-xl z-50">

          {/* Header */}

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">

            <div className="flex items-center gap-2">

              <BellRing size={16} className="text-slate-600" />

              <span className="text-sm font-semibold text-slate-800">
                Inventory Alerts
              </span>

            </div>

            <span className="text-xs text-slate-500">
              {alerts.length} active
            </span>

          </div>

          {/* Alerts List */}

          <div className="max-h-[280px] overflow-y-auto">

            {alerts.length === 0 && (

              <div className="p-6 text-center text-sm text-slate-500">
                No alerts right now
              </div>

            )}

            {alerts.map((alert, index) => (

              <div
                key={index}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-l-4 border-yellow-400 transition"
              >

                <AlertTriangle
                  size={18}
                  className="text-yellow-600 mt-[2px]"
                />

                <div className="flex flex-col text-sm">

                  <span className="font-medium text-slate-800">
                    {alert.productName}
                  </span>

                  <span className="text-slate-500 text-xs">
                    {alert.warehouseName} - {alert.location}
                  </span>

                  <span className="text-xs font-medium text-red-600 mt-1">
                    Remaining Qty: {alert.qty}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>

  );

}