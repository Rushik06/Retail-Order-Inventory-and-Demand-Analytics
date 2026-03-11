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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

/* ---------- TYPES ---------- */

type WarehouseStock = {
  warehouse: string;
  total_stock: number;
};

type TopSellingProduct = {
  product: string;
  total_sold: number;
};

type CategoryDistribution = {
  category: string;
  total_products: number;
};

type ChartsData = {
  warehouseStock: WarehouseStock[];
  topSellingProducts: TopSellingProduct[];
  categoryDistribution: CategoryDistribution[];
};

type Props = {
  charts: ChartsData;
};

/* COLORS  */

const COLORS = ["#6366F1", "#22C55E", "#EF4444", "#F59E0B", "#06B6D4"];

export default function DashboardCharts({ charts }: Props) {

  return (

    <div className="space-y-6">

      {/*BAR CHARTS ROW  */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Warehouse Stock */}

        <Card>

          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Warehouse Stock Distribution
            </CardTitle>
          </CardHeader>

          <CardContent className="h-[340px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={charts.warehouseStock}
                margin={{ top: 20, right: 20, left: 0, bottom: 70 }}
              >

                <XAxis
                  dataKey="warehouse"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />

                <YAxis tick={{ fontSize: 12 }} />

                <Tooltip />

                <Bar
                  dataKey="total_stock"
                  fill="#6366F1"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />

              </BarChart>

            </ResponsiveContainer>
          </CardContent>
        </Card>


        {/* Top Selling Products */}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Top Selling Products
            </CardTitle>
          </CardHeader>

          <CardContent className="h-[340px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={charts.topSellingProducts}
                margin={{ top: 20, right: 20, left: 0, bottom: 70 }}
              >

                <XAxis
                  dataKey="product"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />

                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />

                <Bar
                  dataKey="total_sold"
                  fill="#22C55E"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
              </BarChart>

            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>


      {/* PIE CHART */}
    {/*eslint-disable @typescript-eslint/no-explicit-any */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Product Category Distribution
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[360px]">

          {charts.categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">

              <PieChart>
                <Pie
                  data={charts.categoryDistribution}
                  dataKey="total_products"
                  nameKey="category"
                  cx="50%"
                  cy="45%"
                  outerRadius={110}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ name, percent = 0 }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {charts.categoryDistribution.map((_:any, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                </Pie>

                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

          ) : (

            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No category data available
            </div>

          )}

        </CardContent>
      </Card>
    </div>

  );
}