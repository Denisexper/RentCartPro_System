import { create } from "zustand";
import { persist } from "zustand/middleware";

const applyTheme = (isDark) => {
  document.documentElement.classList.toggle("dark", isDark);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const next = !get().isDark;
        applyTheme(next);
        set({ isDark: next });
      },
      init: () => {
        applyTheme(get().isDark);
      },
    }),
    { name: "theme-storage" }
  )
);
