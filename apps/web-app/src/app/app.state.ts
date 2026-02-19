import { create } from "zustand";
import type { AuthUser } from "@/types/auth.types";
import{persist} from "zustand/middleware";
interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null });
      },
    }),
    {
      name: "auth-storage", 
    }
  )
);