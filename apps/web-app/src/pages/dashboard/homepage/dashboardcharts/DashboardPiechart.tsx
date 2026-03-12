import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import type { Props } from "@/types/dashboard.types";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6", "#14B8A6"];

/*eslint-disable @typescript-eslint/no-explicit-any */
const renderInsideLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name
}: any) => {

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
    >
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

export default function DashboardPieCharts({ charts }: Props) {

  return (

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Product Categories */}

      <Card className="shadow-sm">

        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-700">
            Product Category Distribution
          </CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
                data={charts.categoryDistribution.map(c => ({
                  ...c,
                  total_products: Number(c.total_products)
                }))}
                dataKey="total_products"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                paddingAngle={3}
                labelLine={false}
                label={renderInsideLabel}
              >

                {charts.categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}

              </Pie>

              <Legend verticalAlign="bottom" iconType="circle" />

              <Tooltip formatter={(v) => [`${v} products`, "Products"]} />

            </PieChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>


      {/* Orders by Status */}

      <Card className="shadow-sm">

        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-700">
            Orders by Status
          </CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
                data={charts.ordersByStatus.map(o => ({
                  ...o,
                  count: Number(o.count)
                }))}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={120}
                paddingAngle={3}
                labelLine={false}
                label={renderInsideLabel}
              >

                {charts.ordersByStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}

              </Pie>

              <Legend verticalAlign="bottom" iconType="circle" />

              <Tooltip formatter={(v) => [`${v} orders`, "Orders"]} />

            </PieChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>

  );

}