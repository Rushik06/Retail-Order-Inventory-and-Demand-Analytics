import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export const Sidebar = () => {
  return (
    <div className="w-64 bg-dashboard-card border-r border-dashboard-border p-6 space-y-6">
      <h2 className="text-xl font-bold text-brand">Auth Dashboard</h2>

      <div className="space-y-2">
        <Link to="/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
        </Link>

        <Link to="/profile">
          <Button variant="ghost" className="w-full justify-start">
            Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};