import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
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

      // persist only user
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);