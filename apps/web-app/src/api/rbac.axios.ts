
import api from "./axios";

export const assignRole = async (
  userId: string,
  roleName: string
) => {

  const response = await api.post("/rbac/assign-role", {
    userId,
    roleName,
  });

  return response.data;
};


export const getAdminOnly = async () => {

  const response = await api.get("/rbac/admin-only");

  return response.data;
};


export const getSuperAdminOnly = async () => {

  const response = await api.get("/rbac/super-admin-only");

  return response.data;
};