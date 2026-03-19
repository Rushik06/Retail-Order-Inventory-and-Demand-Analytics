import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";

import {
  getProductName,
  formatOrderDate,
  type RecentOrdersProps
} from "@/utils/recentorder-table.helpers";

export default function RecentOrdersTable({
  data,
  products
}: RecentOrdersProps) {

  return (

    <Card className="shadow-sm">

      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-700">
          Recent Orders
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div className="max-h-[320px] overflow-y-auto">

          <table className="w-full text-sm">

            <thead className="border-b sticky top-0 bg-white">

              <tr className="text-slate-600 font-medium">

                <th className="text-left py-3">Customer</th>
                <th className="text-left py-3">Product</th>
                <th className="text-right py-3">Order Date</th>
                <th className="text-right py-3">Status</th>

              </tr>

            </thead>

            <tbody>

              {data?.map((order, index) => {

                const productName =
                  order.product_name ||
                  getProductName(products, order.product_id);

                const formattedDate = formatOrderDate(order.order_date);

                return (

                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="py-3 font-medium text-slate-800">
                      {order.customer_name || "Customer"}
                    </td>

                    <td className="py-3 text-slate-600">
                      {productName}
                    </td>

                    <td className="py-3 text-right font-semibold">
                      {formattedDate}
                    </td>

                    <td className="py-3 text-right">

                      <span
                        className={`
px-2 py-1 rounded-md text-xs font-semibold
${order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-500"
                          }
`}
                      >
                        {order.status.toLowerCase()}
                      </span>

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