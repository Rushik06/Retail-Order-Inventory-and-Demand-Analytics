import {
    Package,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
    Warehouse
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/Card";

import { formatCurrency,formatFullCurrency } from "@/utils/currency.formatter";
import type { DashboardCountersProps } from "@/types/dashboard.types";

export default function DashboardCounters({ counters }: DashboardCountersProps) {

    return (

        <div className="grid grid-cols-5 gap-6">

            {/* Total Products */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-2 min-w-0">

                    <Package className="h-5 w-4 text-blue-500 flex-shrink-0" />

                    <CardTitle className="text-sm font-medium whitespace-nowrap">
                        Total Products
                    </CardTitle>

                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold">
                        {counters.totalProducts}
                    </p>
                </CardContent>
            </Card>


            {/* Warehouses */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-2 min-w-0">

                    <Warehouse className="h-5 w-4 text-purple-500 flex-shrink-0" />

                    <CardTitle className="text-sm font-medium whitespace-nowrap">
                        Total Warehouses
                    </CardTitle>

                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold">
                        {counters.totalWarehouses}
                    </p>
                </CardContent>
            </Card>


            {/* Orders */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-2 min-w-0">

                    <ShoppingCart className="h-5 w-4 text-green-500 flex-shrink-0" />

                    <CardTitle className="text-sm font-medium whitespace-nowrap">
                        Total Orders
                    </CardTitle>

                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold">
                        {counters.totalOrders}
                    </p>
                </CardContent>
            </Card>


            {/* Low Stock */}
            <Card className="shadow-sm">

                <CardHeader className="flex flex-row items-center gap-2 pb-2 min-w-0">

                    <AlertTriangle className="h-5 w-4 text-red-500 flex-shrink-0" />

                    <CardTitle className="text-sm font-medium whitespace-nowrap">
                        Low Stock
                    </CardTitle>

                </CardHeader>

                <CardContent>
                    <p className="text-3xl font-bold text-red-500">
                        {counters.lowStockItems}
                    </p>
                </CardContent>

            </Card>


            {/* Revenue */}
            <Card className="shadow-sm hover:shadow-md transition">

                <CardHeader className="flex flex-row items-center gap-2 pb-2 min-w-0">

                    <TrendingUp className="h-5 w-4 text-indigo-500 flex-shrink-0" />

                    <CardTitle className="text-sm font-medium whitespace-nowrap">
                        Total Revenue
                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <p
                        className="text-3xl font-bold"
                        title={formatFullCurrency(counters.totalRevenue)}
                    >
                        {formatCurrency(counters.totalRevenue)}
                    </p>

                </CardContent>

            </Card>

        </div>

    );

}