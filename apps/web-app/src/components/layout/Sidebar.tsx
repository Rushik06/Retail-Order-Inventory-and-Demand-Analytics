import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, Shield } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">

      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-800">
          Retail Inventory
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Home
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          <User size={18} />
          Profile
        </NavLink>

        <NavLink
          to="/dashboard/security"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          <Shield size={18} />
          Security
        </NavLink>
      </nav>
    </aside>
  );
}