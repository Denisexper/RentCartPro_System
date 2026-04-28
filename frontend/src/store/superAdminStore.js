import { create } from "zustand";

export const useSuperAdminStore = create((set) => ({
  selectedTenantId: null,
  setSelectedTenantId: (id) => set({ selectedTenantId: id }),
}));
