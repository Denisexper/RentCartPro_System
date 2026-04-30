import { create } from "zustand";
import { permissionService } from "../services/permission.service";

export const usePermissionsStore = create((set, get) => ({
  keys: [],
  loaded: false,
  loading: false,

  load: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const res = await permissionService.getMyPermissions();
      set({ keys: res.data.data ?? [], loaded: true });
    } catch {
      set({ keys: [], loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ keys: [], loaded: false, loading: false }),

  can: (key) => get().keys.includes(key),
}));
