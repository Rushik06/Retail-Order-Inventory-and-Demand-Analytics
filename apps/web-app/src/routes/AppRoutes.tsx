import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../app/app.state";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Profile from "../pages/dashboard/profile/Profile";
import Home from "@/pages/dashboard/Home";
import Security from "@/pages/dashboard/Security";
import Products from "@/pages/dashboard/product/Product";
import Orders from "@/pages/dashboard/order/Order";

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
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Dashboard pages */}
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="security" element={<Security />} />

        {/* NEW: Product & Order Pages */}
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;