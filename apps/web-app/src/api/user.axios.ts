import api from "../api/axios";

export const getUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};