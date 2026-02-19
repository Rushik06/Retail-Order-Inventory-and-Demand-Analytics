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