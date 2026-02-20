import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, Shield } from "lucide-react";
import { useAuthStore } from "@/app/app.state";

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen">

      {/* Top Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-800">
          Retail Inventory
        </h1>
      </div>

      {/* Navigation */}
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

      {/* Bottom User Section */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="text-sm">
            <p className="font-medium text-slate-800">
              {user?.name}
            </p>
            <p className="text-slate-500 text-xs truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}