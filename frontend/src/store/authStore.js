import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      savedSASession: null,
      lastSlug: null,

      login: (token, user, slug) => {
        localStorage.setItem("token", token);
        if (slug) localStorage.setItem("lastSlug", slug);
        set({ token, user, lastSlug: slug ?? null });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null, savedSASession: null });
      },

      impersonate: (token, user) => {
        const { token: currentToken, user: currentUser } = get();
        localStorage.setItem("token", token);
        set({
          token,
          user,
          savedSASession: { token: currentToken, user: currentUser },
        });
      },

      exitImpersonation: () => {
        const { savedSASession } = get();
        if (!savedSASession) return;
        localStorage.setItem("token", savedSASession.token);
        set({ token: savedSASession.token, user: savedSASession.user, savedSASession: null });
      },
    }),
    { name: "auth-storage" }
  )
);
