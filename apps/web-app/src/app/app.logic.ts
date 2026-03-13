import api from "../api/axios";
import { setTokens } from "../utils/token";
import { useAuthStore } from "./app.state";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  setTokens(res.data.accessToken, res.data.refreshToken);

  useAuthStore.getState().setUser(res.data.user);

  return res.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return res.data;
};

/* RBAC LOGIC */

export const assignUserRole = async (
  userId: string,
  roleName: string
) => {
  const res = await api.post("/rbac/assign-role", {
    userId,
    roleName,
  });

  return res.data;
};

/* GET ALL USERS */

export const fetchUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};

/*EMAIL-REQUEST ACCESS */
export const requestRoleAccess = async (roleName: string) => {

  const res = await api.post("/rbac/request-role", {
    roleName
  });

  return res.data;

};