import { requestRoleAccess } from "@/app/app.logic";
import { toast } from "sonner";
import { useAuthStore } from "@/app/app.state";
import { ShieldCheck, Crown } from "lucide-react";
import { useState } from "react";

export default function RequestAccess() {

  const user = useAuthStore((s) => s.user);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  if (user?.role === "admin" || user?.role === "super_admin") {
    return null;
  }

  const handleRequestAccess = async (role: string) => {

    try {

      setLoadingRole(role);

      await requestRoleAccess(role);

      toast.success("Request sent to admin");

    } catch {

      toast.error("Failed to send request");

    } finally {

      setLoadingRole(null);

    }

  };

  return (

    <div className="mb-6">

      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        Request Role Upgrade
      </h3>

      <div className="flex gap-4">

        {/* STAFF -> Request Manager */}

        {user?.role === "staff" && (
          <button
            onClick={() => handleRequestAccess("manager")}
            disabled={loadingRole === "manager"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
            border border-blue-200 bg-blue-50 text-blue-600 
            hover:bg-blue-100 transition text-sm font-medium"
          >
            <ShieldCheck size={16} />
            {loadingRole === "manager" ? "Requesting..." : "Request Manager"}
          </button>
        )}

        {/* STAFF + MANAGER -> Request Admin */}

        {(user?.role === "staff" || user?.role === "manager") && (
          <button
            onClick={() => handleRequestAccess("admin")}
            disabled={loadingRole === "admin"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
            border border-blue-200 bg-white text-blue-600 
            hover:bg-blue-50 transition text-sm font-medium"
          >
            <Crown size={16} />
            {loadingRole === "admin" ? "Requesting..." : "Request Admin"}
          </button>
        )}

      </div>

    </div>

  );

}