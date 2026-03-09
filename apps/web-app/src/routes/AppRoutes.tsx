import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../app/app.state";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Profile from "../pages/dashboard/profile/Profile";
import Home from "@/pages/dashboard/Home";
import Security from "@/pages/dashboard/Security";
import Products from "@/pages/dashboard/product/Product";
import Orders from "@/pages/dashboard/order/Order";

import Inventory from "@/pages/dashboard/inventory/Inventory";
import Warehouse from "@/pages/dashboard/warehouse/Warehouse";
import Users from "../pages/dashboard/users/Users";

import DashboardLayout from "../components/layout/DashboardLayout";

function AppRoutes() {
  const user = useAuthStore((s) => s.user);

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
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

        {/* Product - manager + admin */}
        <Route
          path="products"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin", "super_admin"]}>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager", "admin", "super_admin"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Inventory - manager + admin */}
        <Route
          path="inventory"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin", "super_admin"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        {/* Warehouse - admin only */}
        <Route
          path="warehouses"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <Warehouse />
            </ProtectedRoute>
          }
        />

        {/* Users - admin only */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;