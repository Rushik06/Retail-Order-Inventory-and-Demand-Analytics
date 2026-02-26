import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./TopNavBar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="shrink-0 border-b border-slate-200 bg-white">
          <Topbar />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}