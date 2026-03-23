import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";

import {
  type InventoryActivityProps,
  getProductName,
  getWarehouse
} from "@/utils/activity-table.helpers";

export default function InventoryActivityTable({
  data,
  products,
  warehouses
}: InventoryActivityProps) {

  return (

    <Card className="shadow-sm">

      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-700">
          Inventory Activity
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div className="max-h-[320px] overflow-y-auto">

          <table className="w-full text-sm">

            <thead className="border-b sticky top-0 bg-white">

              <tr className="text-slate-600 font-medium">

                <th className="text-left py-3">Product</th>
                <th className="text-left py-3">Warehouse</th>
                <th className="text-left py-3">Location</th>
                <th className="text-left py-3">Action</th>
                <th className="text-right py-3">Qty</th>

              </tr>

            </thead>

            <tbody>

              {data?.map((item, index) => {

                const productName =
                  getProductName(products, item.product_id);

                const warehouse =
                  getWarehouse(warehouses, item.warehouse_id);

                return (

                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="py-3 font-medium text-slate-800">
                      {productName}
                    </td>

                    <td className="py-3 text-slate-600">
                      {warehouse?.name || "Unknown"}
                    </td>

                    <td className="py-3 text-slate-500">
                      {warehouse?.location || "-"}
                    </td>

                    <td className="py-3 capitalize text-slate-700">
                      {item.action_type.toLowerCase()}
                    </td>

                    <td className="py-3 text-right font-semibold text-slate-900">
                      {item.new_available_qty}
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </CardContent>

    </Card>

  );

}