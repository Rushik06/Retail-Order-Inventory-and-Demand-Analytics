/* eslint-disable */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Shield,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/app/app.state";

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { to: "/dashboard", label: "Home", icon: <LayoutDashboard size={18} /> },
    { to: "/dashboard/products", label: "Products", icon: <Package size={18} /> },
    { to: "/dashboard/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { to: "/dashboard/profile", label: "Profile", icon: <User size={18} /> },
    { to: "/dashboard/security", label: "Security", icon: <Shield size={18} /> },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Top */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        {!collapsed && (
          <h1 className="text-lg font-bold text-slate-800">
            Retail Inventory
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <span className={collapsed ? "mx-auto" : ""}>
              {link.icon}
            </span>

            {!collapsed && link.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom User */}
      <div className="border-t border-slate-200 p-4">
        <div
          className={`relative group flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold cursor-pointer">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {!collapsed && (
            <div className="text-sm">
              <p className="font-medium text-slate-800">
                {user?.name}
              </p>
              <p className="text-slate-500 text-xs truncate">
                {user?.email}
              </p>
            </div>
          )}

          {/* Hover Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-16 opacity-0 group-hover:opacity-100 transition bg-white shadow-lg border border-slate-200 rounded-lg p-3 text-sm whitespace-nowrap">
              <p className="font-medium text-slate-800">
                {user?.name}
              </p>
              <p className="text-slate-500 text-xs">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}