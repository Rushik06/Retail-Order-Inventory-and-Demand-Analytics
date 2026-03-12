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

/*eslint-disable @typescript-eslint/no-explicit-any */

export default function DashboardCounters({ counters }: any) {
    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `₹${(value / 1000000).toFixed(1)}M`;
        }

        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1)}K`;
        }

        return `₹${value}`;
    };

    const formatFullCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);

    return (

        <div className="grid grid-cols-5 gap-6">

            {/* Total Products */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">

                    <Package className="h-5 w-5 text-blue-500" />

                    <CardTitle className="text-sm font-medium">
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
                <CardHeader className="flex flex-row items-center gap-2 pb-2">

                    <Warehouse className="h-5 w-5 text-purple-500" />

                    <CardTitle className="text-sm font-medium">
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

            <Card className="flex-1 min-w-0 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">

                    <ShoppingCart className="h-5 w-5 text-green-500" />

                    <CardTitle className="text-sm font-medium">
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

                <CardHeader className="flex flex-row items-center gap-2 pb-2">

                    <AlertTriangle className="h-5 w-5 text-red-500" />

                    <CardTitle className="text-sm font-medium">
                        Low Stock
                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <p className="text-3xl font-bold text-red-500">
                        {counters.lowStockItems}
                    </p>

                </CardContent>

            </Card>


            <Card className="shadow-sm hover:shadow-md transition">

                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    <CardTitle className="text-sm font-medium">
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