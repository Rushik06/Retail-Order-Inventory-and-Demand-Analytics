import { api } from "../api/axios";
import { useAppStore } from "./app.state";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  useAppStore.getState().setUser(res.data.user);
  useAppStore.getState().setToken(res.data.accessToken);

  localStorage.setItem("token", res.data.accessToken);
};

export const fetchProfile = async () => {
  const res = await api.get("/profile");

  useAppStore.getState().setUser(res.data);
};