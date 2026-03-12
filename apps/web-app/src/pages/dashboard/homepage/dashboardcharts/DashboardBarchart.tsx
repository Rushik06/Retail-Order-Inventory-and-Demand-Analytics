import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import type { Props } from "@/types/dashboard.types";
import { CustomXAxisTick } from "@/utils/bargraph.helpers";

export default function DashboardBarCharts({ charts }: Props) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Warehouse Distribution */}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-700">
            Warehouse Stock Distribution
          </CardTitle>
        </CardHeader>

        <CardContent className="min-h-[340px]">

          <ResponsiveContainer width="100%" height={340}>

            <BarChart
              data={charts.warehouseStock.map(w => ({
                ...w,
                total_stock: Number(w.total_stock)
              }))}
              margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
              barCategoryGap="30%"
              barGap={4}
            >

              {/* Style Grid */}

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#b7cae2"
              />

              <XAxis
                dataKey="warehouse"
                interval={0}
                height={80}
                tick={<CustomXAxisTick />}
                tickMargin={10}
              />

              <YAxis
                tick={{ fontSize: 13, fill: "#334155", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: 13
                }}
              />

              <Bar
                dataKey="total_stock"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
                barSize={32}
                animationDuration={900}
              />

            </BarChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

      {/* Top Selling Products */}

      <Card className="shadow-sm">

        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-700">
            Top Selling Products
          </CardTitle>
        </CardHeader>

        <CardContent className="min-h-[340px]">

          <ResponsiveContainer width="100%" height={320}>

            <BarChart
              data={charts.topSellingProducts.map(p => ({
                ...p,
                total_sold: Number(p.total_sold)
              }))}
              margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
            >

              {/* Style Grid */}

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#b7cae2"
              />

              <XAxis
                dataKey="product"
                interval={0}
                height={80}
                tick={<CustomXAxisTick />}
                tickMargin={10}
              />

              <YAxis
                tick={{ fontSize: 13, fill: "#334155", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: 13
                }}
              />

              <Bar
                dataKey="total_sold"
                fill="#22C55E"
                radius={[6, 6, 0, 0]}
                barSize={32}
                animationDuration={900}
              />

            </BarChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>

  );

}