import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/app/app.state";
import api from "@/api/axios";
import { toast } from "sonner";
import InventoryAlerts from "./NotificationAlert";
import log from "loglevel";                                   

export default function Topbar() {

  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await api.post("/auth/logout", {
        refreshToken,
      });

      toast.success("Logged out successfully");

    } catch (err) {
      log.error("Logout failed:", err);                        
      toast.error("Logout failed");

    } finally {
      logout();
      navigate("/login");
    }

  };

  return (

    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      {/* Left Section */}

      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Welcome, {user?.name}
        </h2>
      </div>

      {/* Right Section */}

      <div className="flex items-center gap-4">

        {/* Inventory Alerts */}
        <InventoryAlerts />

        {/* Logout Button */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 h-9 px-3 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>

  );
}