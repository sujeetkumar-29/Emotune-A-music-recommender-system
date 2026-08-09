import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null, // { id, email, name, avatar_url, is_verified, theme_preference, created_at }

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      login: (accessToken, refreshToken, user = null) => set({ accessToken, refreshToken, user }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null }),

      isAuthenticated: () => !!useAuthStore.getState().accessToken,
    }),
    {
      name: "emotune-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
