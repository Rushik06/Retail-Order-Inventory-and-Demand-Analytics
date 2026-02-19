import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/app/app.state";

export default function Topbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <h2 className="text-lg font-semibold text-slate-700">
        Welcome, {user?.name}
      </h2>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium text-sm"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}