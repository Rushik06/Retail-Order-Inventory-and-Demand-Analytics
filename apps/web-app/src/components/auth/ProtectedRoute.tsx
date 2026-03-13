import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/app/app.state";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {

  const user = useAuthStore((state) => state.user);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role restriction
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;