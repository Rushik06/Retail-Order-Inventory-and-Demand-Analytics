import { Package, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Retail Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Inventory & order analytics overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">

        {/* Total Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">
              Total Products
            </h3>
            <Package className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-3">
            1,245
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">
              Total Orders
            </h3>
            <ShoppingCart className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-3">
            324
          </p>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">
              Low Stock Items
            </h3>
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-red-600 mt-3">
            12
          </p>
        </div>

        {/* Revenue Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">
              Revenue Today
            </h3>
            <TrendingUp className="text-indigo-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-3">
            Rs18,540/-
          </p>
        </div>

      </div>

      {/* Secondary Section */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Recent Orders
          </h3>
          <p className="text-sm text-slate-500">
            Latest customer orders will appear here.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Inventory Alerts
          </h3>
          <p className="text-sm text-slate-500">
            Low stock and restock notifications will appear here.
          </p>
        </div>

      </div>

    </div>
  );
}