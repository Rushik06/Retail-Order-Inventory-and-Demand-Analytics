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

const COLORS = ["#6366F1", "#22C55E", "#EF4444", "#F59E0B", "#06B6D4"];
/*eslint-disable @typescript-eslint/no-explicit-any */
export default function DashboardCharts({ charts }: any) {

    return (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Warehouse Chart */}

            <Card>

                <CardHeader>
                    <CardTitle>Warehouse Stock Distribution</CardTitle>
                </CardHeader>

                <CardContent className="h-[340px]">

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={charts.warehouseStock}
                            margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
                        >

                            <XAxis
                                dataKey="warehouse"
                                interval={0}
                                angle={-25}
                                textAnchor="end"
                                height={80}
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis tick={{ fontSize: 12 }} />

                            <Tooltip
                                formatter={(value) => [`Stock: ${value}`, "Total Stock"]}
                            />

                            <Bar
                                dataKey="total_stock"
                                fill="#6366F1"
                                radius={[6, 6, 0, 0]}
                                barSize={30}
                            />

                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


            {/* Top Selling Products */}

            <Card>

                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>

                <CardContent className="h-[340px]">

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={charts.topSellingProducts}
                            margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
                        >

                            <XAxis
                                dataKey="product"
                                interval={0}
                                angle={-25}
                                textAnchor="end"
                                height={80}
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis tick={{ fontSize: 12 }} />

                            <Tooltip
                                formatter={(value) => [`Sold: ${value}`, "Units Sold"]}
                            />

                            <Bar
                                dataKey="total_sold"
                                fill="#22C55E"
                                radius={[6, 6, 0, 0]}
                                barSize={30}
                            />

                        </BarChart>
                    </ResponsiveContainer>
              </CardContent>
            </Card>


            {/* Category Distribution */}

            <Card>

                <CardHeader>
                    <CardTitle>Product Category Distribution</CardTitle>
                </CardHeader>

                <CardContent className="h-[340px]">

                    {charts.categoryDistribution?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={charts.categoryDistribution}
                                    dataKey="total_products"
                                    nameKey="category"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={100}
                                    innerRadius={40}
                                    paddingAngle={3}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent ?? 0 * 100).toFixed(0)}%`
                                    }
                                >

                                    {charts.categoryDistribution.map((_: any, index: number) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}

                                </Pie>

                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                />

                                <Tooltip
                                    formatter={(value) => [`Products: ${value}`, "Category"]}
                                />
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