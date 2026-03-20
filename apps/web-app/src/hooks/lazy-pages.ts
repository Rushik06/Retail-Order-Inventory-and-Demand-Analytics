import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const Profile = lazy(() => import("../pages/dashboard/profile/Profile"));
const Home = lazy(() => import("../pages/dashboard/homepage/Home"));
const Security = lazy(() => import("../pages/dashboard/Security"));

const Products = lazy(() => import("../pages/dashboard/product/Product"));
const Orders = lazy(() => import("../pages/dashboard/order/Order"));
const Inventory = lazy(() => import("../pages/dashboard/inventory/Inventory"));
const Warehouse = lazy(() => import("../pages/dashboard/warehouse/Warehouse"));
const Users = lazy(() => import("../pages/dashboard/users/Users"));

export const useLazyPages = () => {
  return {
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
  };
};