import { requestRoleAccess } from "@/app/app.logic";
import { toast } from "sonner";
import { useAuthStore } from "@/app/app.state";
import { ShieldCheck, Crown } from "lucide-react";

export default function RequestAccess() {

  const user = useAuthStore((s) => s.user);

  if (user?.role === "admin" || user?.role === "super_admin") {
    return null;
  }

  const handleRequestAccess = async (role: string) => {

    try {

      await requestRoleAccess(role);

      toast.success("Request sent to admin");

    } catch  {

      toast.error(
         "Failed to send request"
      );

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
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
            border border-blue-200 bg-blue-50 text-blue-600 
            hover:bg-blue-100 transition text-sm font-medium"
          >
            <ShieldCheck size={16} />
            Request Manager
          </button>
        )}

        {/* STAFF + MANAGER -> Request Admin */}

        {(user?.role === "staff" || user?.role === "manager") && (
          <button
            onClick={() => handleRequestAccess("admin")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
            border border-blue-200 bg-white text-blue-600 
            hover:bg-blue-50 transition text-sm font-medium"
          >
            <Crown size={16} />
            Request Admin
          </button>
        )}

      </div>

    </div>

  );

}