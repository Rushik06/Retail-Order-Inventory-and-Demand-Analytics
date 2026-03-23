import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/auth.types";
import api from "../api/axios";
import { clearTokens } from "../utils/token";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      logout: async () => {
        try {
      
          await api.post("/auth/logout"); 
        } catch {
      
        } finally {
          clearTokens();       
          set({ user: null }); 
        }
      },
    }),
    {
      name: "auth-storage",

    
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);