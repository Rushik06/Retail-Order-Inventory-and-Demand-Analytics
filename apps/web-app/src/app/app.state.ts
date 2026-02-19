import { create } from "zustand";

interface AppState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;

  accessToken: string | null; 

  setUser: (user: AppState["user"]) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ accessToken: token }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));