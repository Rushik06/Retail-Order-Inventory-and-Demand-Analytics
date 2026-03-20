import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";

import { useAuthStore } from "../app/app.state";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import RouteSkeleton from "@/components/loaders/RouteSkeleton";
import { useLazyPages } from "@/hooks/lazy-pages";

import type { RolesModule } from "@/types/app-routes.types";

function AppRoutes() {

  const user = useAuthStore((s) => s.user);

  const {
    Login,
    Register,
    ForgotPassword,
    ResetPassword,
    Profile,
    Home,
    Security,
    Products,
    Orders,
    Inventory,
    Warehouse,
    Users
  } = useLazyPages();

  const [roles, setRoles] = useState<RolesModule | null>(null);

  /* Lazy load role constants */

  useEffect(() => {

    const loadRoles = async () => {

      const module = await import("@/constants/roles.constants");

      setRoles(module);

    };

    loadRoles();

  }, []);

  if (!roles) {
    return <RouteSkeleton />;
  }

  const {
    PRODUCT_ROLES,
    ORDER_ROLES,
    INVENTORY_ROLES,
    WAREHOUSE_ROLES,
    USER_ROLES
  } = roles;

  return (

    <Suspense fallback={<RouteSkeleton />}>

      <Routes>

        {/* Root redirect */}

        <Route
          path="/"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Public routes */}

        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Register />
          }
        />

        <Route
          path="/forgot-password"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <ResetPassword />
          }
        />

        {/* Protected dashboard */}

        <Route
          path="/dashboard"
          element={
            user ? (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >

          {/* Dashboard pages */}

          <Route index element={<Home />} />

          <Route path="profile" element={<Profile />} />

          <Route path="security" element={<Security />} />

          {/* Products */}

          <Route
            path="products"
            element={
              <ProtectedRoute allowedRoles={PRODUCT_ROLES}>
                <Products />
              </ProtectedRoute>
            }
          />

          {/* Orders */}

          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={ORDER_ROLES}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Inventory */}

          <Route
            path="inventory"
            element={
              <ProtectedRoute allowedRoles={INVENTORY_ROLES}>
                <Inventory />
              </ProtectedRoute>
            }
          />

          {/* Warehouses */}

          <Route
            path="warehouses"
            element={
              <ProtectedRoute allowedRoles={WAREHOUSE_ROLES}>
                <Warehouse />
              </ProtectedRoute>
            }
          />

          {/* Users */}

          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={USER_ROLES}>
                <Users />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* Fallback */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </Suspense>

  );

}

export default AppRoutes;